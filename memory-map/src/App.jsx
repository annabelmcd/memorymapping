import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css'

const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const center = [-122.31327, 47.66063];

const markers = [
  { lng: -122.3308, lat: 47.6821, title: 'sunny reflection', author: 'Annabel', feeling: 'warm', description: 'Sun bathing here during the healing process of a difficult breakup was pivotal to my process of moving on. This was one way I explored time outdoors as my favorite form of self-care.' },
  { lng: -122.3153, lat: 47.6565, title: 'elm 532', author: 'Liya', feeling: 'wistful', description: 'when i got to live with two girls who became some of my best friends. it was not always easy to dorm, but it was always worth it.' },
  { lng: -122.3073, lat: 47.6538, title: 'naptime', author: 'Liya', feeling: 'calm', description: 'took a nap after a difficult exam on this bench in the springtime. may have looked crazy but i dont regret it.' },
  { lng: -122.3092, lat: 47.6616, title: 'crying on a frat lawn', author: 'Liya', feeling: 'intense', description: 'sobbed on the phone with an ex during a frat party. not my proudest moment, passersby were very concerned.' },
  { lng: -122.3133, lat: 47.6574, title: 'meeting my best friend / roommate', author: 'Liya', feeling: 'tender', description: 'before freshman year even started, this was our first time meeting in person. she greeted me with a hug.' },
  { lng: -122.2940, lat: 47.6574, title: 'walking study', author: 'Liya', feeling: 'wistful', description: 'did a sociology study where i had to walk around union bay with no phone, no earbuds, etc. for 6 weeks in a row. found it incredibly healing.' },
  { lng: -122.3044, lat: 47.6476, title: 'seattle feels like home', author: 'Liya', feeling: 'calm', description: 'i hate seattle weather 99% of the time, but the first true sunny day of spring at the cut with friends is one of the most blissful experiences in the world' },
  { lng: -122.3134, lat: 47.6584, title: 'the worst day of college', author: 'Liya', feeling: 'intense', description: 'left a terrible meeting here and immediatley got terrible news. wouldnt wish that day on anyone.' },
  { lng: -122.3076, lat: 47.6639, title: '"girlhouse"', author: 'Liya', feeling: 'tender', description: 'though i never lived here, this house feels like home. so much happened here, good and bad, that defined my college experience' },
  { lng: -122.3063, lat: 47.6536, title: 'my college job', author: 'Liya', feeling: 'warm', description: 'worked as a research assistant in ece for almost 3 years!' },
  { lng: -122.3143, lat: 47.6516, title: 'committed to uw', author: 'Liya', feeling: 'alive', description: 'accepted my offer here with a prickly pear margarita' },
  { lng: -122.3006, lat: 47.6566, title: 'illegal parking', author: 'Annabel', feeling: 'calm', description: 'Ive never paid to park in this lot. Ive come to to believe that the traffic cop just passes over my car intentionally.' },
  { lng: -122.3163, lat: 47.6559, title: 'dorm blues', author: 'Annabel', feeling: 'tender', description: 'maple hall was my dorm freshman year. all of my friends lived on north campus and I felt pretty lonley here.' },
  { lng: -122.3131, lat: 47.6574, title: 'hinge date', author: 'Annabel', feeling: 'alive', description: 'During my single era I went on a hinge date with a guy who was apparently a dj. I never saw him again...' },
  { lng: -122.3176, lat: 47.6626, title: 'god bless trader joes', author: 'Annabel', feeling: 'warm', description: 'oh how I love trader joes. their frozen food and unique desserts have carried me through college. also the go-to spot for picnic treats.' },
  { lng: -122.3247, lat: 47.6648, title: 'community', author: 'Annabel', feeling: 'warm', description: 'The people Ive lived with in this house have been some of the strongest community Ive ever experienced.' },
  { lng: -122.3023, lat: 47.6530, title: 'long hours in the basement', author: 'Annabel', feeling: 'intense', description: 'My office is in the basement of this building and Ive spent way too many hours working down there loosing track of time.' },
  { lng: -122.2946, lat: 47.6418, title: 'kayak date', author: 'Annabel', feeling: 'calm', description: 'I had one of my favorite dates here. My partner took me through lily pads in a kayak and showed me a place that was special to him. We sat and talked forever on the water in the sun.' },
  { lng: -122.3356, lat: 47.6447, title: 'picnic with the gals', author: 'Annabel', feeling: 'alive', description: 'Ive had many a picnic at gas works during the spring with the girlies. Looking out at the Seattle skyline past the water reminds me why I moved here.' },
  { lng: -122.3110, lat: 47.6583, title: 'a lunch break cry', author: 'Annabel', feeling: 'tender', description: 'I sat under this tree and cried for a while one sunny spring day. A squirrel came and cheered me up.' },
  { lng: -122.3087, lat: 47.6591, title: 'first college class', author: 'Annabel', feeling: 'intense', description: 'My first ever college class was in this building. I remember the day as super rainy, and I wasnt used to climbing up hills yet. I was covered in rain by the time I got there, and the professor showed up late.' },
  { lng: -122.3024, lat: 47.6505, title: 'marching band memories', author: 'Annabel', feeling: 'alive', description: 'As a member of the marching band, UW football games are a significant piece of my college experience. This stadium has begun to feel like home. Im not ready to leave it all behind.' },
  { lng: -122.3254, lat: 47.6615, title: 'self-care friday mornings', author: 'Annabel', feeling: 'tender', description: 'This coffee shop fueled my creativity and reminded me who I was during tough times.' },
  { lng: -122.3132, lat: 47.6683, title: 'Cry baby', author: 'Eli', feeling: 'intense', description: 'definitley cried here after a party because I saw an ex. Im not a drunk crier but that night I was.' },
  { lng: -122.3132, lat: 47.6698, title: 'Coffee mornings', author: 'Eli', feeling: 'tender', description: 'my favorite coffee shop, I brought Felix here so many mornings before work <3' },
  { lng: -122.3139, lat: 47.6634, title: 'current apartment', author: 'Eli', feeling: 'intense', description: 'I have laughed cried partied done it all here truly' },
  { lng: -122.3131, lat: 47.6585, title: 'Almon croissant', author: 'Eli', feeling: 'calm', description: 'Used to get breakfast here before class, I loved the almond croissant :3' },
  { lng: -122.3124, lat: 47.6644, title: 'Engagement', author: 'Eli', feeling: 'tender', description: 'I got engaged here! lol' },
  { lng: -122.3041, lat: 47.6664, title: 'Drunk run', author: 'Eli', feeling: 'intense', description: 'ran up these stairs drunk after a party' },
  { lng: -122.2996, lat: 47.6616, title: 'College job', author: 'Eli', feeling: 'alive', description: 'Job that got me through college, thanks din tai' },
  { lng: -122.3141, lat: 47.6585, title: 'first apartment', author: 'Eli', feeling: 'wistful', description: 'First apartment in seattle' },
];

const authors = ['Annabel', 'Liya', 'Eli'];
const feelings = ['warm', 'wistful', 'calm', 'intense', 'tender', 'alive'];

function distanceFeet(lng1, lat1, lng2, lat2) {
  const R = 20902231;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.asin(Math.sqrt(a)));
}

const feelingColors = {
  warm:    '#b45309',
  wistful: '#6d28d9',
  calm:    '#1d4ed8',
  intense: '#dc2626',
  tender:  '#be185d',
  alive:   '#15803d',
};

function App() {
  const mapRef = useRef()
  const mapContainerRef = useRef()
  const markerInstancesRef = useRef([])
  const connectionsModeRef = useRef(false)
  const markerJustClickedRef = useRef(false)
  const aliveAnnotationRef = useRef(null)
  const aliveRectRef = useRef(null)
  const aliveTextRef = useRef(null)
  const aliveTextBgRef = useRef(null)
  const updateAliveAnnotationRef = useRef(null)
  const intenseAnnotationRef = useRef(null)
  const intenseRectRef = useRef(null)
  const intenseTextRef = useRef(null)
  const intenseTextBgRef = useRef(null)
  const updateIntenseAnnotationRef = useRef(null)
  const wistfulAnnotationRef = useRef(null)
  const wistfulRectRef = useRef(null)
  const wistfulTextRef = useRef(null)
  const wistfulTextBgRef = useRef(null)
  const updateWistfulAnnotationRef = useRef(null)
  const calmAnnotationRef = useRef(null)
  const calmRectRef = useRef(null)
  const calmTextRef = useRef(null)
  const calmTextBgRef = useRef(null)
  const updateCalmAnnotationRef = useRef(null)
  const allIntenseAnnotationRef = useRef(null)
  const allIntenseRectRef = useRef(null)
  const allIntenseTextRef = useRef(null)
  const allIntenseTextBgRef = useRef(null)
  const updateAllIntenseAnnotationRef = useRef(null)

  const [authorFilter, setAuthorFilter] = useState('all')
  const [feelingFilter, setFeelingFilter] = useState('all')
  const [mapVisible, setMapVisible] = useState(true)
  const [connectionsMode, setConnectionsMode] = useState(false)

  const clearConnections = () => {
    const src = mapRef.current?.getSource('connections');
    if (src) src.setData({ type: 'FeatureCollection', features: [] });
  };

  useEffect(() => {
    mapboxgl.accessToken = accessToken

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: 12,
      style: 'mapbox://styles/annabelmcd/cmppzyffu002x01sybtkgbvii',
    });

    // SVG annotation overlay
    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2;overflow:visible';

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'roughen');
    filter.setAttribute('x', '-20%'); filter.setAttribute('y', '-20%');
    filter.setAttribute('width', '140%'); filter.setAttribute('height', '140%');
    const turb = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
    turb.setAttribute('type', 'turbulence');
    turb.setAttribute('baseFrequency', '0.02');
    turb.setAttribute('numOctaves', '2');
    turb.setAttribute('seed', '5');
    turb.setAttribute('result', 'noise');
    const disp = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
    disp.setAttribute('in', 'SourceGraphic'); disp.setAttribute('in2', 'noise');
    disp.setAttribute('scale', '4');
    disp.setAttribute('xChannelSelector', 'R'); disp.setAttribute('yChannelSelector', 'G');
    filter.appendChild(turb); filter.appendChild(disp);
    defs.appendChild(filter); svgEl.appendChild(defs);

    const aliveGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    aliveGroup.style.display = 'none';

    const aliveRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    aliveRect.setAttribute('rx', '4'); aliveRect.setAttribute('ry', '4');
    aliveRect.setAttribute('fill', 'rgba(21,128,61,0.07)');
    aliveRect.setAttribute('stroke', '#15803d');
    aliveRect.setAttribute('stroke-width', '2.5');
    aliveRect.setAttribute('filter', 'url(#roughen)');
    aliveGroup.appendChild(aliveRect);

    const makeTextEl = (isBg) => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      el.setAttribute('font-family', 'monospace');
      el.setAttribute('font-size', '12');
      el.setAttribute('font-weight', '600');
      el.setAttribute('text-anchor', 'middle');
      if (isBg) {
        el.setAttribute('stroke', '#ffffff');
        el.setAttribute('stroke-width', '4');
        el.setAttribute('stroke-linejoin', 'round');
        el.setAttribute('fill', 'none');
      } else {
        el.setAttribute('fill', '#15803d');
      }
      ['Annabel feels most alive', 'near water & in the sun'].forEach((line, i) => {
        const ts = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        ts.setAttribute('x', '0');
        ts.setAttribute('dy', i === 0 ? '0' : '17');
        ts.textContent = line;
        el.appendChild(ts);
      });
      return el;
    };

    const aliveTextBg = makeTextEl(true);
    const aliveText = makeTextEl(false);
    aliveGroup.appendChild(aliveTextBg);
    aliveGroup.appendChild(aliveText);
    svgEl.appendChild(aliveGroup);
    mapContainerRef.current.appendChild(svgEl);

    aliveAnnotationRef.current = aliveGroup;
    aliveRectRef.current = aliveRect;
    aliveTextRef.current = aliveText;
    aliveTextBgRef.current = aliveTextBg;

    const annabelAliveCoords = markers
      .filter(m => m.author === 'Annabel' && m.feeling === 'alive')
      .map(m => [m.lng, m.lat]);

    const updateAliveAnnotation = () => {
      if (!aliveRectRef.current || !mapRef.current) return;
      const pts = annabelAliveCoords.map(([lng, lat]) => mapRef.current.project([lng, lat]));
      const xs = pts.map(p => p.x);
      const ys = pts.map(p => p.y);
      const pad = 28;
      const minX = Math.min(...xs) - pad, maxX = Math.max(...xs) + pad;
      const minY = Math.min(...ys) - pad, maxY = Math.max(...ys) + pad;
      const cx = (minX + maxX) / 2;
      aliveRectRef.current.setAttribute('x', minX);
      aliveRectRef.current.setAttribute('y', minY);
      aliveRectRef.current.setAttribute('width', maxX - minX);
      aliveRectRef.current.setAttribute('height', maxY - minY);
      [aliveTextRef.current, aliveTextBgRef.current].forEach(el => {
        if (!el) return;
        el.setAttribute('x', cx);
        el.setAttribute('y', maxY + 20);
        el.querySelectorAll('tspan').forEach(ts => ts.setAttribute('x', cx));
      });
    };

    updateAliveAnnotationRef.current = updateAliveAnnotation;
    mapRef.current.on('move', updateAliveAnnotation);

    // Intense annotation
    const intenseGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    intenseGroup.style.display = 'none';

    const intenseRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    intenseRect.setAttribute('rx', '4'); intenseRect.setAttribute('ry', '4');
    intenseRect.setAttribute('fill', 'rgba(220,38,38,0.07)');
    intenseRect.setAttribute('stroke', '#dc2626');
    intenseRect.setAttribute('stroke-width', '2.5');
    intenseRect.setAttribute('filter', 'url(#roughen)');
    intenseGroup.appendChild(intenseRect);

    const makeIntenseTextEl = (isBg) => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      el.setAttribute('font-family', 'monospace');
      el.setAttribute('font-size', '12');
      el.setAttribute('font-weight', '600');
      el.setAttribute('text-anchor', 'middle');
      if (isBg) {
        el.setAttribute('stroke', '#ffffff');
        el.setAttribute('stroke-width', '4');
        el.setAttribute('stroke-linejoin', 'round');
        el.setAttribute('fill', 'none');
      } else {
        el.setAttribute('fill', '#b91c1c');
      }
      const ts = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      ts.setAttribute('x', '0');
      ts.setAttribute('dy', '0');
      ts.textContent = 'Annabel feels intense on campus.';
      el.appendChild(ts);
      return el;
    };

    const intenseTextBg = makeIntenseTextEl(true);
    const intenseText = makeIntenseTextEl(false);
    intenseGroup.appendChild(intenseTextBg);
    intenseGroup.appendChild(intenseText);
    svgEl.appendChild(intenseGroup);

    intenseAnnotationRef.current = intenseGroup;
    intenseRectRef.current = intenseRect;
    intenseTextRef.current = intenseText;
    intenseTextBgRef.current = intenseTextBg;

    const annabelIntenseCoords = markers
      .filter(m => m.author === 'Annabel' && m.feeling === 'intense')
      .map(m => [m.lng, m.lat]);

    const updateIntenseAnnotation = () => {
      if (!intenseRectRef.current || !mapRef.current) return;
      const pts = annabelIntenseCoords.map(([lng, lat]) => mapRef.current.project([lng, lat]));
      const xs = pts.map(p => p.x);
      const ys = pts.map(p => p.y);
      const pad = 28;
      const minX = Math.min(...xs) - pad, maxX = Math.max(...xs) + pad;
      const minY = Math.min(...ys) - pad, maxY = Math.max(...ys) + pad;
      const cx = (minX + maxX) / 2;
      intenseRectRef.current.setAttribute('x', minX);
      intenseRectRef.current.setAttribute('y', minY);
      intenseRectRef.current.setAttribute('width', maxX - minX);
      intenseRectRef.current.setAttribute('height', maxY - minY);
      [intenseTextRef.current, intenseTextBgRef.current].forEach(el => {
        if (!el) return;
        el.setAttribute('x', cx);
        el.setAttribute('y', maxY + 20);
        el.querySelectorAll('tspan').forEach(ts => ts.setAttribute('x', cx));
      });
    };

    updateIntenseAnnotationRef.current = updateIntenseAnnotation;
    mapRef.current.on('move', updateIntenseAnnotation);

    // Wistful annotation
    const wistfulGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    wistfulGroup.style.display = 'none';

    const wistfulRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    wistfulRect.setAttribute('rx', '4'); wistfulRect.setAttribute('ry', '4');
    wistfulRect.setAttribute('fill', 'rgba(109,40,217,0.07)');
    wistfulRect.setAttribute('stroke', '#6d28d9');
    wistfulRect.setAttribute('stroke-width', '2.5');
    wistfulRect.setAttribute('filter', 'url(#roughen)');
    wistfulGroup.appendChild(wistfulRect);

    const makeWistfulTextEl = (isBg) => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      el.setAttribute('font-family', 'monospace');
      el.setAttribute('font-size', '12');
      el.setAttribute('font-weight', '600');
      el.setAttribute('text-anchor', 'middle');
      if (isBg) {
        el.setAttribute('stroke', '#ffffff');
        el.setAttribute('stroke-width', '4');
        el.setAttribute('stroke-linejoin', 'round');
        el.setAttribute('fill', 'none');
      } else {
        el.setAttribute('fill', '#6d28d9');
      }
      ['Eli and Liya are wistful', 'over their early living spaces.'].forEach((line, i) => {
        const ts = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        ts.setAttribute('x', '0');
        ts.setAttribute('dy', i === 0 ? '0' : '17');
        ts.textContent = line;
        el.appendChild(ts);
      });
      return el;
    };

    const wistfulTextBg = makeWistfulTextEl(true);
    const wistfulText = makeWistfulTextEl(false);
    wistfulGroup.appendChild(wistfulTextBg);
    wistfulGroup.appendChild(wistfulText);
    svgEl.appendChild(wistfulGroup);

    wistfulAnnotationRef.current = wistfulGroup;
    wistfulRectRef.current = wistfulRect;
    wistfulTextRef.current = wistfulText;
    wistfulTextBgRef.current = wistfulTextBg;

    const wistfulCoords = markers
      .filter(m => m.title === 'elm 532' || m.title === 'first apartment')
      .map(m => [m.lng, m.lat]);

    const updateWistfulAnnotation = () => {
      if (!wistfulRectRef.current || !mapRef.current) return;
      const pts = wistfulCoords.map(([lng, lat]) => mapRef.current.project([lng, lat]));
      const xs = pts.map(p => p.x);
      const ys = pts.map(p => p.y);
      const pad = 28;
      const minX = Math.min(...xs) - pad, maxX = Math.max(...xs) + pad;
      const minY = Math.min(...ys) - pad, maxY = Math.max(...ys) + pad;
      const cx = (minX + maxX) / 2;
      wistfulRectRef.current.setAttribute('x', minX);
      wistfulRectRef.current.setAttribute('y', minY);
      wistfulRectRef.current.setAttribute('width', maxX - minX);
      wistfulRectRef.current.setAttribute('height', maxY - minY);
      [wistfulTextRef.current, wistfulTextBgRef.current].forEach(el => {
        if (!el) return;
        el.setAttribute('x', cx);
        el.setAttribute('y', maxY + 20);
        el.querySelectorAll('tspan').forEach(ts => ts.setAttribute('x', cx));
      });
    };

    updateWistfulAnnotationRef.current = updateWistfulAnnotation;
    mapRef.current.on('move', updateWistfulAnnotation);

    // Calm annotation
    const calmGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    calmGroup.style.display = 'none';

    const calmRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    calmRect.setAttribute('rx', '4'); calmRect.setAttribute('ry', '4');
    calmRect.setAttribute('fill', 'rgba(29,78,216,0.07)');
    calmRect.setAttribute('stroke', '#1d4ed8');
    calmRect.setAttribute('stroke-width', '2.5');
    calmRect.setAttribute('filter', 'url(#roughen)');
    calmGroup.appendChild(calmRect);

    const makeCalmTextEl = (isBg) => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      el.setAttribute('font-family', 'monospace');
      el.setAttribute('font-size', '12');
      el.setAttribute('font-weight', '600');
      el.setAttribute('text-anchor', 'middle');
      if (isBg) {
        el.setAttribute('stroke', '#ffffff');
        el.setAttribute('stroke-width', '4');
        el.setAttribute('stroke-linejoin', 'round');
        el.setAttribute('fill', 'none');
      } else {
        el.setAttribute('fill', '#1d4ed8');
      }
      ['Annabel and Liya feel calm', 'during spring and summertime in Seattle.'].forEach((line, i) => {
        const ts = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        ts.setAttribute('x', '0');
        ts.setAttribute('dy', i === 0 ? '0' : '17');
        ts.textContent = line;
        el.appendChild(ts);
      });
      return el;
    };

    const calmTextBg = makeCalmTextEl(true);
    const calmText = makeCalmTextEl(false);
    calmGroup.appendChild(calmTextBg);
    calmGroup.appendChild(calmText);
    svgEl.appendChild(calmGroup);

    calmAnnotationRef.current = calmGroup;
    calmRectRef.current = calmRect;
    calmTextRef.current = calmText;
    calmTextBgRef.current = calmTextBg;

    const calmCoords = markers
      .filter(m => ['naptime', 'seattle feels like home', 'kayak date'].includes(m.title))
      .map(m => [m.lng, m.lat]);

    const updateCalmAnnotation = () => {
      if (!calmRectRef.current || !mapRef.current) return;
      const pts = calmCoords.map(([lng, lat]) => mapRef.current.project([lng, lat]));
      const xs = pts.map(p => p.x);
      const ys = pts.map(p => p.y);
      const pad = 28;
      const minX = Math.min(...xs) - pad, maxX = Math.max(...xs) + pad;
      const minY = Math.min(...ys) - pad, maxY = Math.max(...ys) + pad;
      const cx = (minX + maxX) / 2;
      calmRectRef.current.setAttribute('x', minX);
      calmRectRef.current.setAttribute('y', minY);
      calmRectRef.current.setAttribute('width', maxX - minX);
      calmRectRef.current.setAttribute('height', maxY - minY);
      [calmTextRef.current, calmTextBgRef.current].forEach(el => {
        if (!el) return;
        el.setAttribute('x', cx);
        el.setAttribute('y', maxY + 20);
        el.querySelectorAll('tspan').forEach(ts => ts.setAttribute('x', cx));
      });
    };

    updateCalmAnnotationRef.current = updateCalmAnnotation;
    mapRef.current.on('move', updateCalmAnnotation);

    // All:intense annotation
    const allIntenseGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    allIntenseGroup.style.display = 'none';

    const allIntenseRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    allIntenseRect.setAttribute('rx', '4'); allIntenseRect.setAttribute('ry', '4');
    allIntenseRect.setAttribute('fill', 'rgba(220,38,38,0.07)');
    allIntenseRect.setAttribute('stroke', '#dc2626');
    allIntenseRect.setAttribute('stroke-width', '2.5');
    allIntenseRect.setAttribute('filter', 'url(#roughen)');
    allIntenseGroup.appendChild(allIntenseRect);

    const makeAllIntenseTextEl = (isBg) => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      el.setAttribute('font-family', 'monospace');
      el.setAttribute('font-size', '12');
      el.setAttribute('font-weight', '600');
      el.setAttribute('text-anchor', 'middle');
      if (isBg) {
        el.setAttribute('stroke', '#ffffff');
        el.setAttribute('stroke-width', '4');
        el.setAttribute('stroke-linejoin', 'round');
        el.setAttribute('fill', 'none');
      } else {
        el.setAttribute('fill', '#b91c1c');
      }
      ['Eli and Liya had some intense', 'party moments around here.'].forEach((line, i) => {
        const ts = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        ts.setAttribute('x', '0');
        ts.setAttribute('dy', i === 0 ? '0' : '17');
        ts.textContent = line;
        el.appendChild(ts);
      });
      return el;
    };

    const allIntenseTextBg = makeAllIntenseTextEl(true);
    const allIntenseText = makeAllIntenseTextEl(false);
    allIntenseGroup.appendChild(allIntenseTextBg);
    allIntenseGroup.appendChild(allIntenseText);
    svgEl.appendChild(allIntenseGroup);

    allIntenseAnnotationRef.current = allIntenseGroup;
    allIntenseRectRef.current = allIntenseRect;
    allIntenseTextRef.current = allIntenseText;
    allIntenseTextBgRef.current = allIntenseTextBg;

    const allIntenseCoords = markers
      .filter(m => ['current apartment', 'crying on a frat lawn', 'Cry baby', 'Drunk run'].includes(m.title))
      .map(m => [m.lng, m.lat]);

    const updateAllIntenseAnnotation = () => {
      if (!allIntenseRectRef.current || !mapRef.current) return;
      const pts = allIntenseCoords.map(([lng, lat]) => mapRef.current.project([lng, lat]));
      const xs = pts.map(p => p.x);
      const ys = pts.map(p => p.y);
      const pad = 28;
      const minX = Math.min(...xs) - pad, maxX = Math.max(...xs) + pad;
      const minY = Math.min(...ys) - pad, maxY = Math.max(...ys) + pad;
      const cx = (minX + maxX) / 2;
      allIntenseRectRef.current.setAttribute('x', minX);
      allIntenseRectRef.current.setAttribute('y', minY);
      allIntenseRectRef.current.setAttribute('width', maxX - minX);
      allIntenseRectRef.current.setAttribute('height', maxY - minY);
      [allIntenseTextRef.current, allIntenseTextBgRef.current].forEach(el => {
        if (!el) return;
        el.setAttribute('x', cx);
        el.setAttribute('y', maxY + 20);
        el.querySelectorAll('tspan').forEach(ts => ts.setAttribute('x', cx));
      });
    };

    updateAllIntenseAnnotationRef.current = updateAllIntenseAnnotation;
    mapRef.current.on('move', updateAllIntenseAnnotation);

    mapRef.current.on('load', () => {
      mapRef.current.addSource('connections', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
      mapRef.current.addLayer({
        id: 'connections-layer',
        type: 'line',
        source: 'connections',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 2.5,
          'line-opacity': 0.9,
        },
      });
      mapRef.current.addLayer({
        id: 'connections-labels',
        type: 'symbol',
        source: 'connections',
        layout: {
          'symbol-placement': 'line-center',
          'text-field': ['get', 'label'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Regular'],
          'text-size': 11,
          'text-keep-upright': true,
        },
        paint: {
          'text-color': ['get', 'color'],
          'text-halo-color': '#ffffff',
          'text-halo-width': 2,
        },
      });
    });

    mapRef.current.on('click', () => {
      if (markerJustClickedRef.current) {
        markerJustClickedRef.current = false;
        return;
      }
      clearConnections();
    });

    markerInstancesRef.current = markers.map(({ lng, lat, title, author, feeling, description }) => {
      const color = feelingColors[feeling] || '#c084fc';
      const dotHtml = (author === 'Annabel' || author === 'Eli')
        ? `<img src="${import.meta.env.BASE_URL}${author === 'Annabel' ? 'annabel' : 'eli'}-${feeling}.png" style="width:14px;height:14px;object-fit:contain;flex-shrink:0">`
        : `<span style="width:14px;height:14px;border-radius:50%;background:${color};flex-shrink:0;display:inline-block"></span>`;
      const popupContainer = document.createElement('div');
      popupContainer.style.cssText = 'font-family:monospace;min-width:240px;max-width:280px;font-size:13px;line-height:1.5';
      popupContainer.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
          ${dotHtml}
          <span style="font-weight:700;font-size:14px;color:#1a1a1a">${title}</span>
        </div>
        <div style="color:#666;margin-bottom:10px;font-size:12px">
          by ${author}&nbsp;&nbsp;feeling: <span style="color:${color}">${feeling}</span>
        </div>
        <p style="color:#333;margin:0 0 12px 0">${description}</p>
        <div style="color:#888;font-style:italic;font-size:12px">${lat}, ${lng}</div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25, maxWidth: '300px' })
        .setDOMContent(popupContainer);

      let marker;
      if (author === 'Annabel' || author === 'Eli' || author === 'Liya') {
        const prefix = author === 'Annabel' ? 'annabel' : author === 'Eli' ? 'eli' : author === 'liya';
        const el = document.createElement('img');
        el.src = `${import.meta.env.BASE_URL}${prefix}-${feeling}.png`;
        el.style.cssText = 'width:26px;height:26px;object-fit:contain;cursor:pointer';
        marker = new mapboxgl.Marker({ element: el })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(mapRef.current);
      } else {
        marker = new mapboxgl.Marker({ color, scale: 0.6 })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(mapRef.current);
      }

      marker.getElement().addEventListener('click', () => {
        if (!connectionsModeRef.current) return;
        markerJustClickedRef.current = true;

        const visible = markerInstancesRef.current.filter(
          inst => inst.marker.getElement().style.display !== 'none'
        );

        const nearest = visible
          .filter(inst => inst.marker !== marker)
          .map(inst => {
            const ll = inst.marker.getLngLat();
            const d = Math.hypot(ll.lng - lng, ll.lat - lat);
            return { inst, d };
          })
          .sort((a, b) => a.d - b.d)
          .slice(0, 3);

        const features = nearest.map(({ inst }) => {
          const ll = inst.marker.getLngLat();
          const destColor = feelingColors[inst.feeling] || '#c084fc';
          const ft = distanceFeet(lng, lat, ll.lng, ll.lat);
          return {
            type: 'Feature',
            properties: { color: destColor, label: `${ft.toLocaleString()} ft` },
            geometry: {
              type: 'LineString',
              coordinates: [[lng, lat], [ll.lng, ll.lat]],
            },
          };
        });

        const src = mapRef.current?.getSource('connections');
        if (src) src.setData({ type: 'FeatureCollection', features });
      });

      return { marker, author, feeling };
    });

    return () => {
      mapRef.current.remove()
    }
  }, [])

  useEffect(() => {
    connectionsModeRef.current = connectionsMode;
    if (!connectionsMode) clearConnections();
  }, [connectionsMode]);

  const showAliveAnnotation = authorFilter === 'Annabel' && feelingFilter === 'alive';
  useEffect(() => {
    if (!aliveAnnotationRef.current) return;
    aliveAnnotationRef.current.style.display = showAliveAnnotation ? '' : 'none';
    if (showAliveAnnotation) updateAliveAnnotationRef.current?.();
  }, [showAliveAnnotation]);

  const showIntenseAnnotation = authorFilter === 'Annabel' && feelingFilter === 'intense';
  useEffect(() => {
    if (!intenseAnnotationRef.current) return;
    intenseAnnotationRef.current.style.display = showIntenseAnnotation ? '' : 'none';
    if (showIntenseAnnotation) updateIntenseAnnotationRef.current?.();
  }, [showIntenseAnnotation]);

  const showWistfulAnnotation = authorFilter === 'all' && feelingFilter === 'wistful';
  useEffect(() => {
    if (!wistfulAnnotationRef.current) return;
    wistfulAnnotationRef.current.style.display = showWistfulAnnotation ? '' : 'none';
    if (showWistfulAnnotation) updateWistfulAnnotationRef.current?.();
  }, [showWistfulAnnotation]);

  const showCalmAnnotation = authorFilter === 'all' && feelingFilter === 'calm';
  useEffect(() => {
    if (!calmAnnotationRef.current) return;
    calmAnnotationRef.current.style.display = showCalmAnnotation ? '' : 'none';
    if (showCalmAnnotation) updateCalmAnnotationRef.current?.();
  }, [showCalmAnnotation]);

  const showAllIntenseAnnotation = authorFilter === 'all' && feelingFilter === 'intense';
  useEffect(() => {
    if (!allIntenseAnnotationRef.current) return;
    allIntenseAnnotationRef.current.style.display = showAllIntenseAnnotation ? '' : 'none';
    if (showAllIntenseAnnotation) updateAllIntenseAnnotationRef.current?.();
  }, [showAllIntenseAnnotation]);

  useEffect(() => {
    clearConnections();
  }, [authorFilter, feelingFilter]);

  useEffect(() => {
    markerInstancesRef.current.forEach(({ marker, author, feeling }) => {
      const visible =
        (authorFilter === 'all' || author === authorFilter) &&
        (feelingFilter === 'all' || feeling === feelingFilter);
      marker.getElement().style.display = visible ? 'block' : 'none';
    });
  }, [authorFilter, feelingFilter])

  const visibleCount = markers.filter(m =>
    (authorFilter === 'all' || m.author === authorFilter) &&
    (feelingFilter === 'all' || m.feeling === feelingFilter)
  ).length;

  return (
    <div className="app" data-feeling={feelingFilter}>
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>memory map</h1>
          <p>a collection of places that mean something to each of us, mapped across seattle.</p>
        </div>

        <div className="sidebar-section">
          <h2>by person</h2>
          <button
            className={`filter-btn ${authorFilter === 'all' ? 'active' : ''}`}
            onClick={() => setAuthorFilter('all')}
            style={{ marginBottom: '10px' }}
          >
            all
          </button>
          <div className="filter-group" style={{ flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-between' }}>
            {authors.map(a => (a === 'Annabel' || a === 'Eli' || a === 'Liya') ? (
              <div key={a} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer' }} onClick={() => setAuthorFilter(a)}>
                <img
                  src={`${import.meta.env.BASE_URL}${a.toLowerCase()}-face.png`}
                  alt={a}
                  style={{
                    width: '64px',
                    height: '64px',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    opacity: authorFilter === a ? 1 : 0.45,
                  }}
                />
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--btn-text)', opacity: authorFilter === a ? 1 : 0.6 }}>{a.toLowerCase()}</span>
              </div>
            ) : (
              <button
                key={a}
                className={`filter-btn ${authorFilter === a ? 'active' : ''}`}
                onClick={() => setAuthorFilter(a)}
              >
                {a.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <h2>by feeling</h2>
          <div className="filter-group">
            <button
              className={`filter-btn ${feelingFilter === 'all' ? 'active' : ''}`}
              onClick={() => setFeelingFilter('all')}
            >
              all
            </button>
            {feelings.map(f => (authorFilter === 'Annabel' || authorFilter === 'Eli') ? (
              <div
                key={f}
                onClick={() => setFeelingFilter(f)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  opacity: feelingFilter === f || feelingFilter === 'all' ? 1 : 0.45,
                }}
              >
                <img
                  src={`${import.meta.env.BASE_URL}${authorFilter.toLowerCase()}-${f}.png`}
                  alt={f}
                  style={{ width: '36px', height: '36px', objectFit: 'contain' }}
                />
                <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>{f}</span>
              </div>
            ) : (
              <button
                key={f}
                className={`filter-btn ${feelingFilter === f ? 'active' : ''}`}
                onClick={() => setFeelingFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <h2>map layer</h2>
          <button
            className={`filter-btn toggle-btn ${mapVisible ? 'active' : ''}`}
            onClick={() => {
              if (!mapVisible) {
                window.location.reload()
              } else {
                setMapVisible(false)
              }
            }}
          >
            {mapVisible ? 'on' : 'off'}
          </button>
        </div>

        <div className="sidebar-section">
          <h2>connections</h2>
          <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '0 0 8px 0', lineHeight: 1.4 }}>
            click any point to see its 3 closest neighbors
          </p>
          <button
            className={`filter-btn toggle-btn ${connectionsMode ? 'active' : ''}`}
            onClick={() => setConnectionsMode(m => !m)}
          >
            {connectionsMode ? 'on' : 'off'}
          </button>
        </div>

        <div className="sidebar-footer">
          {visibleCount} {visibleCount === 1 ? 'memory' : 'memories'} shown
        </div>
      </div>

      <div className="map-frame">
        <div id='map-container' ref={mapContainerRef} className={mapVisible ? '' : 'map-hidden'} />
      </div>
    </div>
  )
}

export default App
