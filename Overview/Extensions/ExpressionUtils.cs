using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.EntityFrameworkCore.Query.Internal;
using Microsoft.EntityFrameworkCore.Storage;
using Expression = System.Linq.Expressions.Expression;
using Type = System.Type;

namespace Template.Extensions
{
    public static class DynamicQuerier
    {
        private delegate IQueryable<TResult> QueryableMonad<TInput, TResult>(IQueryable<TInput> input,
            Expression<Func<TInput, TResult>> mapper);

        public static IQueryable<TResult> Select<TInput, TResult>(this IQueryable<TInput> input, string propertyName)
        {
            var property = typeof(TInput).GetProperty(propertyName);
            return CreateSelector<TInput, TResult>(input, property, Queryable.Select);
        }

        private static IQueryable<TResult> CreateSelector<TInput, TResult>(IQueryable<TInput> input,
            MemberInfo property, QueryableMonad<TInput, TResult> method)
        {
            var source = Expression.Parameter(typeof(TInput), "x");
            Expression propertyAccessor = Expression.MakeMemberAccess(source, property);
            var expression = Expression.Lambda<Func<TInput, TResult>>(propertyAccessor, source);
            return method(input, expression);
        }
    }

    public static partial class ExpressionUtils
    {
        public static Expression<Func<T, bool>> BuildPredicate<T>(string propertyName, string comparison,
            string value)
        {
            var parameter = Expression.Parameter(typeof(T), "x");
            var left = propertyName.Split('.').Aggregate((Expression) parameter, Expression.Property);
            var body = MakeComparison(left, comparison, value);
            return Expression.Lambda<Func<T, bool>>(body, parameter);
        }

        private static Expression MakeComparison(Expression left, string comparison, string value)
        {
            switch (comparison)
            {
                case "==":
                    return MakeBinary(ExpressionType.Equal, left, value);
                case "!=":
                    return MakeBinary(ExpressionType.NotEqual, left, value);
                case ">":
                    return MakeBinary(ExpressionType.GreaterThan, left, value);
                case ">=":
                    return MakeBinary(ExpressionType.GreaterThanOrEqual, left, value);
                case "<":
                    return MakeBinary(ExpressionType.LessThan, left, value);
                case "<=":
                    return MakeBinary(ExpressionType.LessThanOrEqual, left, value);
                case "Contains":
                    return Expression.Call(MakeString(left), "Contains", Type.EmptyTypes,
                        Expression.Constant(value, typeof(string)));
                case "StartsWith":
                case "EndsWith":
                    return Expression.Call(MakeString(left), comparison, Type.EmptyTypes,
                        Expression.Constant(value, typeof(string)));
                default:
                    throw new NotSupportedException($"Invalid comparison operator '{comparison}'.");
            }
        }

        private static Expression MakeString(Expression source)
        {
            return Expression.Call(
                source.Type == typeof(string) ? source : Expression.Call(source, "ToString", Type.EmptyTypes),
                "ToLower", Type.EmptyTypes);
        }

        private static Expression MakeBinary(ExpressionType type, Expression left, string value)
        {
            object typedValue = value;
            if (left.Type != typeof(string))
            {
                if (string.IsNullOrEmpty(value))
                {
                    typedValue = null;
                    if (Nullable.GetUnderlyingType(left.Type) == null)
                        left = Expression.Convert(left, typeof(Nullable<>).MakeGenericType(left.Type));
                }
                else
                {
                    typedValue = Convert.ChangeType(value, Nullable.GetUnderlyingType(left.Type) ?? left.Type);
                }
            }

            var right = Expression.Constant(typedValue, left.Type);
            return Expression.MakeBinary(type, left, right);
        }

        public static Expression<Func<T, bool>> True<T>()
        {
            return f => true;
        }

        public static Expression<Func<T, bool>> False<T>()
        {
            return f => false;
        }

        public static Expression<Func<T, bool>> Or<T>(this Expression<Func<T, bool>> expr1,
            Expression<Func<T, bool>> expr2)
        {
            var invokedExpr = Expression.Invoke(expr2, expr1.Parameters.Cast<Expression>());
            return Expression.Lambda<Func<T, bool>>
                (Expression.OrElse(expr1.Body, invokedExpr), expr1.Parameters);
        }

        public static Expression<Func<T, bool>> And<T>(this Expression<Func<T, bool>> expr1,
            Expression<Func<T, bool>> expr2)
        {
            var invokedExpr = Expression.Invoke(expr2, expr1.Parameters.Cast<Expression>());
            return Expression.Lambda<Func<T, bool>>
                (Expression.AndAlso(expr1.Body, invokedExpr), expr1.Parameters);
        }
    }

    public static partial class QueryableExtensions
    {
        public static IQueryable<T> Where<T>(this IQueryable<T> source, string propertyName, string comparison,
            string[] values)
        {
            return source.Where(ExpressionUtils.BuildPredicate<T>(propertyName, comparison, values[0]));
        }

        public static IOrderedQueryable<T> OrderBy<T>(this IQueryable<T> source, string property, bool asc)
        {
            return ApplyOrdering<T>(source, property, asc ? "OrderBy" : "OrderByDescending");
        }

        static IOrderedQueryable<T> ApplyOrdering<T>(IQueryable<T> source, string property, string methodName)
        {
            string[] props = property.Split('.');
            Type type = typeof(T);
            ParameterExpression arg = Expression.Parameter(type, "x");
            Expression expr = arg;
            foreach (string prop in props)
            {
                // use reflection (not ComponentModel) to mirror LINQ
                PropertyInfo pi = type.GetProperty(prop);
                expr = Expression.Property(expr, pi);
                type = pi.PropertyType;
            }

            Type delegateType = typeof(Func<,>).MakeGenericType(typeof(T), type);
            LambdaExpression lambda = Expression.Lambda(delegateType, expr, arg);

            object result = typeof(Queryable).GetMethods().Single(
                    method => method.Name == methodName
                              && method.IsGenericMethodDefinition
                              && method.GetGenericArguments().Length == 2
                              && method.GetParameters().Length == 2)
                .MakeGenericMethod(typeof(T), type)
                .Invoke(null, new object[] { source, lambda });
            return (IOrderedQueryable<T>) result;
        }

        public static IOrderedQueryable<T> OrderBy<T>(this IQueryable<T> source, string property)
        {
            return ApplyOrdering<T>(source, property, "OrderBy");
        }

        public static IOrderedQueryable<T> OrderByDescending<T>(this IQueryable<T> source, string property)
        {
            return ApplyOrdering<T>(source, property, "OrderByDescending");
        }

        public static IQueryable<T> ApplyPaging<T>(this IQueryable<T> query, QueryObject queryObj)
        {
            if (queryObj.Page <= 0)
                queryObj.Page = 1;

            if (queryObj.PageSize <= 0)
                queryObj.PageSize = 10;

            return query.Skip((queryObj.Page - 1) * queryObj.PageSize).Take(queryObj.PageSize);
        }

        public static async Task<QueryResultResource<T>> ApplyQueryObject<T>(this IQueryable<T> query,
            QueryObject queryObject)
        {
            QueryResultResource<T> queryResult = new QueryResultResource<T>();

            if (queryObject != null)
            {
                queryResult.MultiSelectColumns = ApplyMultiSelectColumns(query, queryObject);


                if (queryObject.Filters != null && queryObject.Filters.Length > 0)
                {
                    foreach (KeyValuePairResource filter in queryObject.Filters)
                    {
                        Expression<Func<T, bool>> allPredicates = null;
                        foreach (var filterValue in filter.Values)
                        {
                            string comparison = String.Empty;
                            if (
                                filterValue is long ||
                                filterValue is double ||
                                filterValue is decimal ||
                                filterValue == null)
                            {
                                comparison = "==";
                                    
                            }
                            else if (filterValue is string)
                            {
                                comparison = "Contains";
                                
                            }

                            string stringFilterValue = filterValue?.ToString().ToLower();
                            var predicate =
                                ExpressionUtils.BuildPredicate<T>(
                                    filter.Key,
                                    comparison,
                                    stringFilterValue
                                );
                            allPredicates = allPredicates == null ? predicate : allPredicates.Or(predicate);
                        }

                        query = query.Where(allPredicates);
                    }
                }


                if (!string.IsNullOrEmpty(queryObject.SortBy))
                {
                    query = query.OrderBy(queryObject.SortBy, queryObject.IsSortAscending.GetValueOrDefault(true));
                }

                queryResult.TotalItems = query.Count();

                query = query.ApplyPaging(queryObject);
            }

            queryResult.Items = await query.ToListAsync();
            return queryResult;
        }

        private static List<KeyValuePairResource> ApplyMultiSelectColumns<T>(IQueryable<T> query,
            QueryObject queryObject)
        {
            var multiSelectColumns = new List<KeyValuePairResource>();
            if (queryObject.MultiSelectColumns != null && queryObject.MultiSelectColumns.Length > 0)
            {
                var queryResult = query.AsEnumerable();
                foreach (var columnName in queryObject.MultiSelectColumns)
                {
                    var propertyInfo = typeof(T).GetProperty(columnName);
                    if (propertyInfo != null)
                    {
                        multiSelectColumns.Add(new KeyValuePairResource
                        {
                            Key = LowercaseFirst(columnName),
                            Values = queryResult
                                .Select(c =>
                                    new
                                    {
                                        x = propertyInfo.GetValue(c)
                                    })
                                .AsQueryable()
                                .DistinctBy(c => c)
                                .Select(c => c.x).ToArray()
                        });
                    }
                }
            }

            return multiSelectColumns;
        }

        public static IQueryable<TSource> DistinctBy<TSource, TKey>(this IQueryable<TSource> source,
            Expression<Func<TSource, TKey>> keySelector)
        {
            return source.GroupBy(keySelector).Select(x => x.FirstOrDefault());
        }

        static string LowercaseFirst(string s)
        {
            // Check for empty string.
            if (string.IsNullOrEmpty(s))
            {
                return string.Empty;
            }

            // Return char and concat substring.
            return char.ToLower(s[0]) + s.Substring(1);
        }

        public static bool ContainsAny(this string value, params string[] values)
        {
            if (!string.IsNullOrEmpty(value) || values.Length > 0)
            {
                foreach (string one in values)
                {
                    if (value.Contains(one))
                        return true;
                }
            }

            return false;
        }

        public static bool ContainsAll(this string value, params string[] values)
        {
            foreach (string one in values)
            {
                if (!value.Contains(one))
                {
                    return false;
                }
            }

            return true;
        }

    }
}