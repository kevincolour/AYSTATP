export const convertSingleCode = (colorCode) => {
    let hexCode = colorCode.toString(16);
  
    return (hexCode.length == 1) ? ('0' + hexCode) : hexCode;
  }
  
export const rgbToHex = (red, green, blue) => {
    if (isNaN(red) || isNaN(green) || isNaN(blue)) {
      alert('Incorrect RGB Color Code!!!');
      return;
    }
    else {
      return '#' + convertSingleCode(red) + convertSingleCode(green) + convertSingleCode(blue);
    }
  }