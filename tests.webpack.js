var context = require.context('./spec', true, /Spec\.js$/);
context.keys().forEach(context);

var srcContext = require.context('./src', true, /\.js$/);
srcContext.keys().forEach(srcContext);