using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Udemy.Extension
{
    public static class DateTimeExtension
    {
        public static int CalculateAge(this DateTime dateOdBirh)
        {
            var today = DateTime.Today;
            var age = today.Year - dateOdBirh.Year;

            if (dateOdBirh.Date > today.AddYears(-age)) age--;
            return age;
        }
    }
}
