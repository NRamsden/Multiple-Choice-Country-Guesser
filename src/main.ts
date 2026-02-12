import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import testSVG from './countries.svg'

async function displayCountry(countryId: string, containerId = 'country-container') {
  const response = await fetch(testSVG);
  const svgText = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, 'image/svg+xml');

  const target = doc.getElementById(countryId) as SVGGElement | null; // doc.querySelector(`#${countryId}`) as SVGGElement;
  if (!target) return;

  if (target) {
    const newSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // const bbox = target.getBBox();
    newSvg.setAttribute('viewBox', '0 0 800 971'); // match your original
    newSvg.setAttribute('width', '100%');
    newSvg.setAttribute('length', 'auto');
    newSvg.style.position = 'absolute';
    newSvg.style.visibility = 'hidden';

    const clone = target.cloneNode(true) as SVGGElement;
    newSvg.appendChild(clone);

    document.body.appendChild(newSvg);

    // now bbox works
    const bbox2 = clone.getBBox();
    console.log(bbox2.x, bbox2.y, bbox2.width, bbox2.height);

     // create final visible SVG
  const finalSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  const padding = 0;
  finalSvg.setAttribute(
    'viewBox',
    `${bbox2.x - padding} ${bbox2.y - padding} ${bbox2.width + padding * 2} ${bbox2.height + padding * 2}`
  );

  // actual width the box will scale to
  finalSvg.setAttribute('width', '500');
  finalSvg.setAttribute('height', '500');
  finalSvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  // Cleanup hidden SVG
  newSvg.remove();

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', String(bbox2.x));
    rect.setAttribute('y', String(bbox2.y));
    rect.setAttribute('width', String(bbox2.width));
    rect.setAttribute('height', String(bbox2.height));
    rect.setAttribute('fill', 'none');       // transparent fill
    rect.setAttribute('stroke', 'red');      // bounding box color
    rect.setAttribute('stroke-width', '2');  // thickness
    rect.setAttribute('vector-effect', 'non-scaling-stroke');

    // finalSvg.appendChild(rect);                   // bounding box
    finalSvg.appendChild(clone.cloneNode(true));
  document.body.appendChild(finalSvg);

    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = ''; // clear previous country
      container.appendChild(finalSvg);
    }
  }
}

async function getAllCountryIds(): Promise<string[]> {
  const response = await fetch(testSVG);
  const svgText = await response.text();
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, 'image/svg+xml');

  // Select all <g> elements that have an id
  const groups = Array.from(doc.querySelectorAll('g[id]')) as SVGGElement[];

  // Extract their IDs
  return groups.map(g => g.id);
}

function pickRandomCountry(ids: string[]): string {
  const randomIndex = Math.floor(Math.random() * ids.length);
  return ids[randomIndex];
}

async function displayRandomCountry() {
  const ids = await getAllCountryIds();
  const randomCountry = pickRandomCountry(ids);
  console.log('Randomly selected country:', randomCountry);
  displayCountry(randomCountry, 'country-container');
  return randomCountry
}

const ids = await getAllCountryIds();
const randomCountryString = await displayRandomCountry();

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <!--
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <img src="${testSVG}" />
    -->
    <h1>Multiple Choice Country Guesser</h1>
    <div id="country-container"></div>
    <div class="card">
      <button id="button0" class="country-btn" type="button"></button>
      <button id="button1" class="country-btn" type="button"></button>
      <p></p>
      <button id="button2" class="country-btn" type="button"></button>
      <button id="button3" class="country-btn" type="button"></button>
      <p></p>
      <button onClick="window.location.reload();">⟳</button>
    </div>
    <p class="read-the-docs">
      <!-- ${randomCountryString} -->
    </p>
  </div>
`

function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function normalizeButtonWidths() {
  const buttons = Array.from(
    document.querySelectorAll<HTMLButtonElement>('.country-btn')
  )

  const maxWidth = Math.max(
    ...buttons.map(btn => btn.offsetWidth)
  )

  buttons.forEach(btn => {
    btn.style.width = `${maxWidth}px`
  })
}

let fourCountries: string[] = [];
fourCountries.push(randomCountryString);
fourCountries.push(pickRandomCountry(ids));
fourCountries.push(pickRandomCountry(ids));
fourCountries.push(pickRandomCountry(ids));
shuffle(fourCountries);

setupCounter(document.querySelector<HTMLButtonElement>('#button0')!, fourCountries[0], randomCountryString)
setupCounter(document.querySelector<HTMLButtonElement>('#button1')!, fourCountries[1], randomCountryString)
setupCounter(document.querySelector<HTMLButtonElement>('#button2')!, fourCountries[2], randomCountryString)
setupCounter(document.querySelector<HTMLButtonElement>('#button3')!, fourCountries[3], randomCountryString)

// run after all text is rendered
requestAnimationFrame(normalizeButtonWidths)