import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './App.css'

function App() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Configuração da cena
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a2e)

    // Configuração da câmera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5

    // Configuração do renderizador
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)

    // Criar geometria da pirâmide (cone com 4 segmentos radiais = pirâmide quadrada)
    const geometry = new THREE.ConeGeometry(2, 3, 4)

    // Carregar a textura do Barack Obama
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load(
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Official_portrait_of_Barack_Obama.jpg/250px-Official_portrait_of_Barack_Obama.jpg',
      () => {
        // Textura carregada com sucesso
        renderer.render(scene, camera)
      }
    )

    // Criar material com a textura
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      wireframe: false,
      flatShading: true,
    })

    // Criar a mesh da pirâmide
    const pyramid = new THREE.Mesh(geometry, material)
    scene.add(pyramid)

    // Adicionar luzes para iluminar a pirâmide
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)

    const pointLight2 = new THREE.PointLight(0xffffff, 0.5)
    pointLight2.position.set(-5, -5, 5)
    scene.add(pointLight2)

    // Controle de rotação com mouse
    let isDragging = false
    let previousMousePosition = { x: 0, y: 0 }
    let autoRotate = true

    const onMouseDown = (event: MouseEvent) => {
      isDragging = true
      autoRotate = false
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      }
    }

    const onMouseMove = (event: MouseEvent) => {
      if (!isDragging) return

      const deltaX = event.clientX - previousMousePosition.x
      const deltaY = event.clientY - previousMousePosition.y

      // Rotacionar a pirâmide baseado no movimento do mouse
      pyramid.rotation.y += deltaX * 0.01
      pyramid.rotation.x += deltaY * 0.01

      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      }
    }

    const onMouseUp = () => {
      isDragging = false
      // Retomar rotação automática após 1 segundo de inatividade
      setTimeout(() => {
        if (!isDragging) {
          autoRotate = true
        }
      }, 1000)
    }

    // Adicionar event listeners
    renderer.domElement.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    // Função de animação
    const animate = () => {
      requestAnimationFrame(animate)

      // Rotação automática da pirâmide (apenas se não estiver sendo arrastada)
      if (autoRotate) {
        pyramid.rotation.x += 0.01
        pyramid.rotation.y += 0.01
      }

      renderer.render(scene, camera)
    }

    animate()

    // Redimensionar quando a janela mudar de tamanho
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      containerRef.current?.removeChild(renderer.domElement)
      geometry.dispose()
      material.dispose()
      texture.dispose()
      renderer.dispose()
    }
  }, [])

  return <div ref={containerRef} className="app-container-3d" />
}

export default App
