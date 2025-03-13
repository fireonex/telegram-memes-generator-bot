import sharp from 'sharp';

const splitTextIntoLines = (text: string, maxLineLength: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach((word) => {
        if ((currentLine + word).length > maxLineLength) {
            lines.push(currentLine.trim());
            currentLine = '';
        }
        currentLine += `${word} `;
    });

    if (currentLine.trim()) {
        lines.push(currentLine.trim());
    }

    return lines;
};

export const addTextToImage = async (imageBuffer: Buffer, text: string): Promise<Buffer> => {
    const maxLineLength = 20;
    const lines = splitTextIntoLines(text, maxLineLength);

    const lineHeight = 70;
    const paddingBottom = 20;
    const svgHeight = lines.length * lineHeight + paddingBottom;

    const svgText = `
    <svg width="800" height="${svgHeight}">
      <style>
        .title {
          fill: white;
          font-size: 80px;
          font-family: Impact, Arial Black, sans-serif;
          font-weight: bold;
          stroke: black;
          stroke-width: 6px;
          paint-order: stroke fill;
        }
      </style>
      ${lines
        .map(
            (line, index) => `
        <text x="50%" y="${(index + 1) * lineHeight}" text-anchor="middle" class="title">${line}</text>
      `
        )
        .join('')}
    </svg>
  `;

    const svgBuffer = Buffer.from(svgText);

    return sharp(imageBuffer)
        .composite([
            {
                input: svgBuffer,
                gravity: 'south',
            },
        ])
        .toBuffer();
};