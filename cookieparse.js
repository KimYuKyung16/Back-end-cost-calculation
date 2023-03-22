const parseCookies = (cookie = '' ) => // 쿠키 key:value 형태로 파싱하기
  cookie
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, [k,v]) => {
        acc[k.trim()] = decodeURIComponent(v).split(':')[1].split('.')[0]
        return acc;
    }, {});


module.exports = {
  parseCookies: parseCookies,
}