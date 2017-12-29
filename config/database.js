if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb://ivan:ivanevacic@ds133077.mlab.com:33077/onlinenotes-production'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/onlinenotesdevdb'}
}