// import * as MaterialUI from '@mui/material';
// import * as MaterialIcons from '@mui/icons-material';

// // Create scope for Material UI components
// const materialComponentNames = Object.keys(MaterialUI).filter(key =>
//   typeof (MaterialUI as any)[key] === 'function' || typeof (MaterialUI as any)[key] === 'object'
// );

// // Create scope for Material UI icons
// const materialIconNames = Object.keys(MaterialIcons).filter(key =>
//   typeof (MaterialIcons as any)[key] === 'function' || typeof (MaterialIcons as any)[key] === 'object'
// );

// // Combine both into a single scope
// export const materialUIScope = {
//   ...materialComponentNames.reduce((acc, name) => {
//     acc[name] = (MaterialUI as any)[name];
//     return acc;
//   }, {} as Record<string, any>),
  
//   ...materialIconNames.reduce((acc, name) => {
//     acc[name] = (MaterialIcons as any)[name];
//     return acc;
//   }, {} as Record<string, any>)
// };