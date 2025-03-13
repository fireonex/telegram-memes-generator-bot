import sharp from 'sharp';

export const addTextToImage = async (imageBuffer: Buffer, text: string): Promise<Buffer> => {
    const svgText = `
    <svg width="800" height="200">
      <style>
        .title {
          fill: white;
          font-size: 80px;
          font-family: Impact, Arial Black, sans-serif;
          font-weight: bold;
          stroke: black;
          stroke-width: 3px;
          paint-order: stroke fill;
        }
      </style>
      <text x="50%" y="80%" text-anchor="middle" class="title">${text}</text>
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