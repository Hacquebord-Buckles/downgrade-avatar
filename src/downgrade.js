const fileExists = require('file-exists');
const gm = require('gm').subClass({ imageMagick: true });

function getSize(image) {
  return new Promise((resolve, reject) => {
    image.size((error, size) => {
      if (error) {
        reject(error);
      }

      resolve(size);
    });
  });
}

function saveImage(image, destination) {
  return new Promise((resolve, reject) => {
    image.write(destination, (error) => {
      if (error) {
        return reject(error);
      }

      return resolve();
    });
  });
}

const defaultOptions = {
  maintainSize: true
};

function downgrade(source, destination, options = {}) {
  options = Object.assign({}, defaultOptions, options);

  return new Promise((resolve, reject) => {
    if (!fileExists(source)) {
      reject(new Error("Can't find source file"));
    }

    const image = gm(source);

    resolve(getSize(image)
      .then((size) => {
        image.colors(8)
             .scale(100, 100);

        if (options.maintainSize) {
          image.scale(size.width, size.height);
        }

        return saveImage(image, destination);
      })
    );
  });
}

module.exports = downgrade;
