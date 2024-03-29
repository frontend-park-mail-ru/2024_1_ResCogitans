export function starSvg(percentage : number) : string {
  return`<svg height="24" viewBox="0 0 24 24" width="24">
<defs>
  <linearGradient id="grad1">
    <stop offset="0%" stop-color="blue" />
    <stop offset="${percentage}%" stop-color="blue" />
    <stop offset="${percentage}%" stop-color="white" />
    <stop offset="100%" stop-color="white" />
  </linearGradient>
</defs>
<path d="M0 0h24v24H0z" fill="none"/>
<path
      fill="url(#grad1)"
      stroke="black"
      stroke-width="1.5"
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
/>
<path d="M0 0h24v24H0z" fill="none"/>
</svg>`
}
