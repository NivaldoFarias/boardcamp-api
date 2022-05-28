export const url = new RegExp(
  '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$',
  'i',
);
export const image = new RegExp(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/im);
export const cpf = new RegExp(/^\d{12}$/);
export const phone = new RegExp(
  /(?:^\([0]?[1-9]{2}\)|^[0]?[1-9]{2}[\.-\s]?)[9]?[1-9]\d{3}[\.-\s]?\d{4}$/,
);
export const birthday = new RegExp(
  /^(19\d{2}|(20[0-2]{2}|20[01]\d))-(0[1-9]|1[0-2])-([1-3]0|[0-2][1-9]|31)$/,
);
