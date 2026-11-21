// levels.js — the hunt data for Lantern Lane.
// One entry per scene: its name, its time limit, and every difference with
// the panel coordinates where it lives. The left panel always shows the
// plain scene; the right panel shows the variant. A difference is found by
// clicking near its centre on either panel.

export const LEVELS = [
  {
    id: 'lantern-lane',
    name: 'Lantern Lane',
    subtitle: 'A night market alley, lit for the festival',
    timeLimit: 180,
    diffs: [
      { id: 'moon', x: 88, y: 66, r: 30, label: 'The moon changed shape' },
      { id: 'bird', x: 478, y: 58, r: 20, label: 'A night bird vanished' },
      { id: 'cat', x: 432, y: 118, r: 26, label: 'The roof cat is gone' },
      { id: 'lantern', x: 282, y: 148, r: 24, label: 'A lantern changed colour' },
      { id: 'window', x: 178, y: 232, r: 24, label: 'A window went dark' },
      { id: 'awning', x: 352, y: 252, r: 22, label: 'An awning stripe is missing' },
      { id: 'flowers', x: 118, y: 344, r: 26, label: 'The flower pot is empty' },
    ],
  },
  {
    id: 'harbour-dawn',
    name: 'Harbour Dawn',
    subtitle: 'First light over the fishing boats',
    timeLimit: 150,
    diffs: [
      { id: 'sunrays', x: 72, y: 68, r: 30, label: 'The sun lost its rays' },
      { id: 'gull', x: 302, y: 66, r: 20, label: 'A gull flew away' },
      { id: 'flag', x: 152, y: 82, r: 22, label: 'The harbour flag changed colour' },
      { id: 'beam', x: 452, y: 92, r: 28, label: 'The lighthouse beam is off' },
      { id: 'smoke', x: 252, y: 148, r: 24, label: 'The chimney smoke is gone' },
      { id: 'porthole', x: 122, y: 282, r: 20, label: 'A porthole is missing' },
      { id: 'buoy', x: 382, y: 322, r: 22, label: 'The buoy changed colour' },
      { id: 'fish', x: 202, y: 332, r: 22, label: 'The jumping fish is gone' },
      { id: 'crate', x: 482, y: 352, r: 24, label: 'A crate vanished from the dock' },
      { id: 'rope', x: 88, y: 362, r: 22, label: 'The rope coil is gone' },
    ],
  },
  {
    id: 'starlight-garden',
    name: 'Starlight Garden',
    subtitle: 'Fireflies over the old garden wall',
    timeLimit: 150,
    diffs: [
      { id: 'firefly', x: 96, y: 84, r: 20, label: 'A firefly went out' },
      { id: 'butterfly', x: 468, y: 96, r: 22, label: 'The butterfly flew off' },
      { id: 'mushroom', x: 178, y: 322, r: 24, label: 'A mushroom lost its spots' },
      { id: 'fountain', x: 282, y: 196, r: 28, label: 'The fountain stopped sparkling' },
      { id: 'birdhouse', x: 402, y: 148, r: 24, label: 'The birdhouse door is shut' },
      { id: 'flower', x: 132, y: 238, r: 22, label: 'A bloom changed colour' },
      { id: 'stone', x: 342, y: 352, r: 22, label: 'A stepping stone is missing' },
      { id: 'lantern-glow', x: 498, y: 262, r: 24, label: 'A garden lamp went dark' },
      { id: 'snail', x: 232, y: 368, r: 20, label: 'The snail crawled away' },
      { id: 'star', x: 368, y: 56, r: 18, label: 'A star blinked out' },
      { id: 'ivy', x: 58, y: 196, r: 22, label: 'The ivy lost a leaf' },
      { id: 'bench', x: 452, y: 318, r: 24, label: 'The bench cushion is gone' },
    ],
  },
];

export function levelById(id) {
  return LEVELS.find((level) => level.id === id) ?? LEVELS[0];
}

export function totalDifferences() {
  return LEVELS.reduce((sum, level) => sum + level.diffs.length, 0);
}
