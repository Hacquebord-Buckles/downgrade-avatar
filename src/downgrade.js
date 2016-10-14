const fileExists = require('file-exists');
const gm = require('gm').subClass({ imageMagick: true });

function calculateReduction(width, height) {
  return {
    width: Math.sqrt(width * 12.5),
    height: Math.sqrt(height * 12.5)
  };
}

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
        const { width, height } = size;
        const {
          width: newWidth,
          height: newHeight
        } = calculateReduction(width, height);

        image.colors(8)
             .scale(newWidth, newHeight);

        if (options.maintainSize) {
          image.scale(width, height);
        }

        return saveImage(image, destination);
      })
    );
  });
}

module.exports = downgrade;
