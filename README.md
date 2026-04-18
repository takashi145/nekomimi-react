# nekomimi-react

A small React component that adds cat ears (猫耳) to wrapped UI elements.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | *(required)* | The content to wrap with cat ears |
| `earColor` | `string` | `'#ffffff'` | Color of the outer ear |
| `earGap` | `number` | `10` | Gap between the two ears (px) |
| `earAlign` | `'left' \| 'center' \| 'right' \| 'space-between'` | `'center'` | Horizontal alignment of the ears (`space-between` places ears at the far left and right edges) |
| `earOffsetX` | `number` | `0` | Horizontal offset for both ears (px) |
| `leftEarOffsetX` | `number` | `0` | Additional horizontal offset for the left ear |
| `rightEarOffsetX` | `number` | `0` | Additional horizontal offset for the right ear |
| `leftEarOffsetY` | `number` | `0` | Vertical offset for the left ear |
| `rightEarOffsetY` | `number` | `0` | Vertical offset for the right ear |
| `earScale` | `number` | `1` | Scale factor for the ear size |
| `earTilt` | `number` | `0` | Tilt angle for both ears (degrees) |
| `leftEarTilt` | `number` | `earTilt` | Tilt angle for the left ear |
| `rightEarTilt` | `number` | `earTilt` | Tilt angle for the right ear |
| `earInset` | `number` | `0` | How far the ears overlap into the content (px) |
| `showEars` | `boolean` | `true` | Whether to show the ears |
| `style` | `CSSProperties` | — | Style applied to the wrapper element |
| `className` | `string` | — | Class name for the wrapper element |
| `earsStyle` | `CSSProperties` | — | Style applied to the ears SVG element |
| `earsClassName` | `string` | — | Class name for the ears SVG element |
