using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace Overview.Extensions
{
    [ModelBinder(typeof(GridQueryObjectModelBinder<QueryObject>))]
    public class QueryObject
    {
        public KeyValuePairResource[] Filters { get; set; }
        public string[] MultiSelectColumns { set; get; }
        public string SortBy { get; set; }
        public bool? IsSortAscending { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
    
    [ModelBinder(typeof(GridQueryObjectModelBinder<ExcelExportQueryObject>))]
    public class ExcelExportQueryObject : QueryObject
    {
        public string Title { get; set; }
        public QueryColumn[] Columns { get; set; }
    }

    public class QueryColumn
    {
        public string Key { get; set; }
        public string Title { get; set; }
        public int Width { get; set; }
    }

    public class KeyValuePairResource
    {
        public string Key { get; set; }
        public object[] Values { get; set; }
    }

    public class QueryResultResource<T>
    {
        public int TotalItems { get; set; }
        public List<KeyValuePairResource> MultiSelectColumns { set; get; }
        public IEnumerable<T> Items { get; set; }
    }

}
