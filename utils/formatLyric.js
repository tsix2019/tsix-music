
/*作者：爱编程的Mark
链接：https://juejin.cn/post/7009211433707962404
来源：稀土掘金*/
/**

* 格式化时间字符串为时间，时间单位为秒

* @param timeString 时间字符串，格式为： mm:ss:ss, 如： 00:01:404

* @returns

*/

export const formatTimeToNumber = (timeString) => {

  let time = 0;

  if (timeString) {

  const splitArr = timeString.split(":").map((item) => Number(item));

  return splitArr[0] * 60 + splitArr[1];

  }

  return time;

};



/**

* 格式化歌词字符串为"时间-歌词"格式的数组

* @param lyric 歌词字符串

* @returns

*/

export const formatLyric = (lyric) => {

  const lyricParts = lyric.split("\n").filter((item) => item);

  return lyricParts.map((item) => {

      const splitItems = item.split("]");

      const lyricItem = {

      time: formatTimeToNumber(splitItems[0].slice(1)),

      text: splitItems[1],

      };

      return lyricItem;

  });

};

