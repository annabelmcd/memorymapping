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

const feelingColors = {
  warm:    '#f5a623',
  wistful: '#a78bfa',
  calm:    '#60a5fa',
  intense: '#f87171',
  tender:  '#f472b6',
  alive:   '#4ade80',
};

function App() {
  const mapRef = useRef()
  const mapContainerRef = useRef()
  const markerInstancesRef = useRef([])

  const [authorFilter, setAuthorFilter] = useState('all')
  const [feelingFilter, setFeelingFilter] = useState('all')
  const [mapVisible, setMapVisible] = useState(true)

  useEffect(() => {
    mapboxgl.accessToken = accessToken

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: 12,
      style: 'mapbox://styles/annabelmcd/cmppzyffu002x01sybtkgbvii',
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
      if (author === 'Annabel' || author === 'Eli') {
        const prefix = author === 'Annabel' ? 'annabel' : 'eli';
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

      return { marker, author, feeling };
    });

    return () => {
      mapRef.current.remove()
    }
  }, [])

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
          <div className="filter-group">
            <button
              className={`filter-btn ${authorFilter === 'all' ? 'active' : ''}`}
              onClick={() => setAuthorFilter('all')}
            >
              all
            </button>
            {authors.map(a => (a === 'Annabel' || a === 'Eli') ? (
              <img
                key={a}
                src={`${import.meta.env.BASE_URL}${a.toLowerCase()}-face.png`}
                alt={a}
                onClick={() => setAuthorFilter(a)}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  opacity: authorFilter === a ? 1 : 0.45,
                }}
              />
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
