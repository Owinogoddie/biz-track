// export const formatCurrency = (amount: number, currency: string = 'USD') => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: currency,
//     }).format(amount);
//   };
  
//   export const formatNumber = (number: number) => {
//     return new Intl.NumberFormat('en-US').format(number);
//   }
export const formatCurrency = (amount: number, currency: string = 'KES') => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
  export const formatNumber = (number: number) => {
    return new Intl.NumberFormat('en-KE').format(number);
  };

//   export const formatCurrency = (amount: number): string => {
//     return new Intl.NumberFormat('en-KE', {
//       style: 'currency',
//       currency: 'KES',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(amount)
//   }