import cheerio from 'cheerio';

const loadFromBrightcove = ($) => {
  const $video = $('video:first-of-type');
  if (!$video) return null;
  const data = $video.data();
  if (!data) return null;
  if (!['videoId', 'account', 'player', 'embed'].every((key) => data[key])) return null;
  return `https://players.brightcove.net/${data.account}/${data.player}_${data.embed}/index.html?videoId=${data.videoId}`;
};

const loadFromIframe = ($) => {
  const $iframe = $('iframe:first-of-type');
  if (!$iframe) return null;
  return $iframe.attr('src') || null;
};

export default (code) => {
  if (!code || typeof code !== 'string') return null;
  const $ = cheerio.load(code);

  const fromIframe = loadFromIframe($);
  if (fromIframe) return fromIframe;
  const fromBrightcove = loadFromBrightcove($);
  if (fromBrightcove) return fromBrightcove;
  return null;
};
