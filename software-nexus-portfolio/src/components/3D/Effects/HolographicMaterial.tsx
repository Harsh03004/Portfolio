import { useRef } from 'react'
import { ShaderMaterial } from 'three'
import { useFrame } from '@react-three/fiber'

interface HolographicMaterialProps {
  color?: string
  opacity?: number
  speed?: number
}

export default function HolographicMaterial({ 
  color = '#00ffff', 
  opacity = 0.7,
  speed = 1.0 
}: HolographicMaterialProps) {
  const materialRef = useRef<ShaderMaterial>(null)

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime * speed
    }
  })

  return (
    <shaderMaterial
      ref={materialRef}
      transparent
      uniforms={{
        time: { value: 0 },
        color: { value: [
          parseInt(color.slice(1, 3), 16) / 255,
          parseInt(color.slice(3, 5), 16) / 255,
          parseInt(color.slice(5, 7), 16) / 255
        ]},
        opacity: { value: opacity }
      }}
      vertexShader={`
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        uniform float time;
        uniform vec3 color;
        uniform float opacity;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          // Fresnel effect for holographic rim
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);
          
          // Scanlines
          float scanline = sin(vUv.y * 50.0 + time * 2.0) * 0.5 + 0.5;
          
          // Glitch effect
          float glitch = step(0.98, sin(time * 10.0 + vUv.y * 20.0));
          
          // Combine effects
          vec3 finalColor = color * (0.5 + fresnel * 0.5);
          finalColor += vec3(scanline * 0.2);
          finalColor += vec3(glitch * 0.3);
          
          float finalOpacity = opacity * (0.7 + fresnel * 0.3);
          
          gl_FragColor = vec4(finalColor, finalOpacity);
        }
      `}
    />
  )
}
