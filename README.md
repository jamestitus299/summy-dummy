# REACT-CODE-CANVAS

A React library that displays the react code and charts available in the recharts library passed to the Canvas

# Usage

`import {ReactCanvas, CheckReactCode } from 'react-code-canvas'`


To Render React component:

`<ReactCanvas
          code={CODE}
          showpreview={true}
          showeditor={false}
          showerror={false}
          scope={SCOPE}
        />`

code (string) - the react code to render (functional component, without import statement, and with export keyword)
showpreview (boolean) - to display the render of the code or not
showperror (boolean) - to display the error message in case of an error in the code
showeditor (boolean) - to display the editor to edit the reac t code
scope (react components) - additional scope that the react code would need


To check if the react code will render of not
`<CheckReactCode 
    code={CODE} 
    scope={SCOPE} 
    returnError={handleError} />`

code (string) - the react code to render (functional component, without import statement, and with export keyword)
scope (react components) - additional scope that the react code would need
returnError (callback) - this return the error in the code as a string; if no error then return null 

