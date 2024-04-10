export function previewJourney(name : string, description : string, id : number) {
    return `<a href="/journey/${id}"><div class="container">
    <h2>${name}</h2>
    <h3>${description}</h3>
</div></a>`;
}

export default previewJourney;