function decorateFunction(wrappedFunction) {
  return async function (...args) {
    console.log(`Calling ${wrappedFunction.name} with arguments: ${JSON.stringify(args)}`);
    try {
      const result = await wrappedFunction.apply(this, args);
      console.log(`${wrappedFunction.name}: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      console.error(`${wrappedFunction.name} threw an error: ${error}`);
      throw error;
    }
  };
}

function decorate(obj) {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'function') {
      console.log(`Decorating ${key}`);
      obj[key] = decorateFunction(obj[key]);
    }
  });
  return obj;
}

module.exports = {
  decorate
};