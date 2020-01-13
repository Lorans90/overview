using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Overview.Models.SeedWork
{
    // https://github.com/dotnet-architecture/eShopOnContainers/blob/master/src/Services/Ordering/Ordering.Domain/SeedWork/Enumeration.cs
    public abstract class Enumeration : IComparable
    {
        public string DescriptionDe { get; private set; }
        public string DescriptionEn { get; private set; }

        public int Id { get; private set; }

        protected Enumeration() { }

        protected Enumeration(int id, string descriptionDe, string descriptionEn)
        {
            Id = id;
            DescriptionEn = descriptionEn;
            DescriptionDe = descriptionDe;
        }

        public override string ToString() => DescriptionEn;

        public static IEnumerable<T> GetAll<T>() where T : Enumeration, new()
        {
            var type = typeof(T);
            var fields = type.GetFields(BindingFlags.Public | BindingFlags.Static | BindingFlags.DeclaredOnly);

            foreach (var info in fields)
            {
                var instance = new T();
                var locatedValue = info.GetValue(instance) as T;

                if (locatedValue != null)
                    yield return locatedValue;
            }
        }

        public override bool Equals(object obj)
        {
            var otherValue = obj as Enumeration;

            // Note: ReferenceEquals avoids call of == operator
            if (ReferenceEquals(null, otherValue))
            {
                return false;
            }

            var typeMatches = GetType().Equals(obj.GetType());
            var valueMatches = Id.Equals(otherValue.Id);

            return typeMatches && valueMatches;
        }

        public override int GetHashCode() => Id.GetHashCode();

        public static int AbsoluteDifference(Enumeration firstValue, Enumeration secondValue)
        {
            var absoluteDifference = Math.Abs(firstValue.Id - secondValue.Id);
            return absoluteDifference;
        }

        public static T FromValue<T>(int value) where T : Enumeration, new()
        {
            var matchingItem = Parse<T, int>(value, "value", item => item.Id == value);
            return matchingItem;
        }

        public static T FromDescriptionDe<T>(string DescriptionDe) where T : Enumeration, new()
        {
            var matchingItem = Parse<T, string>(DescriptionDe, "Description", item => item.DescriptionEn == DescriptionDe);
            return matchingItem;
        }

        private static T Parse<T, K>(K value, string DescriptionDe, Func<T, bool> predicate) where T : Enumeration, new()
        {
            var matchingItem = GetAll<T>().FirstOrDefault(predicate);

            if (matchingItem == null)
                throw new InvalidOperationException($"'{value}' is not a valid {DescriptionDe} in {typeof(T)}");

            return matchingItem;
        }

        public int CompareTo(object other) => Id.CompareTo(((Enumeration)other).Id);

        public static bool operator ==(Enumeration b1, Enumeration b2)
        {
            // Note: ReferenceEquals avoids call of == operator
            if (ReferenceEquals(null, b1))
            {
                return ReferenceEquals(null, b2);
            }

            return b1.Equals(b2);
        }

        public static bool operator !=(Enumeration b1, Enumeration b2)
        {
            return !(b1 == b2);
        }

    }
}