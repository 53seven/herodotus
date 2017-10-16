// up_stream.js
function up_stream() {
  this.write = (log) => {
    console.log('write event');
    let obj = {message: log};
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(obj));
  };

  return this;
}

module.exports = function() {
  return new up_stream();
};