import * as d3 from 'd3'
import { useEffect, useState } from 'react'

type Course = {
  id: string
  name: string
} & d3.SimulationNodeDatum

const courses: { [key: string]: Course } = {
  CS116: {
    id: 'CS116',
    name: 'Computing Fundamentals',
  },
  CS117: {
    id: 'CS117',
    name: 'Object-Oriented Programming',
  },
  CS263: {
    id: 'CS263',
    name: 'Database Management Systems',
  },
  CS11: {
    id: 'CS11',
    name: 'Database Management Systems',
  },
}

type Edge = {
  source: string
  target: string
}

const edges: Edge[] = [
  { source: 'CS116', target: 'CS117' },
  { source: 'CS117', target: 'CS263' }
]

export default function App() {
  return <Graph nodes={Object.values(courses)} edges={edges} />
}

type GraphProps = {
  nodes: Course[]
  edges: Edge[]
}

function Graph({ nodes, edges }: GraphProps) {
  const [nodePositions, setNodePositions] = useState<Course[] | null>(null)
  const { innerWidth, innerHeight } = window

  useEffect(() => {
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(
            edges.map((e) => ({
              source: nodes.find((n) => n.id === e.source)!,
              target: nodes.find((n) => n.id === e.target)!,
            }))
          )
          .id((d) => (d as Course).id)
          .distance(150)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(innerWidth / 2, innerHeight / 2))
      .stop()

    const numIterations = Math.ceil(
      Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())
    )

    simulation.tick(numIterations)

    setNodePositions(nodes)
  }, [nodes, edges, innerHeight, innerWidth])

  if (!nodePositions)
    return <div className="w-screen h-screen">Loading graph...</div>

  return (
    <div className="w-screen h-screen">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${innerWidth} ${innerHeight}`}
      >
        {edges.map((e) => {
          const source = nodePositions.find((n) => n.id === e.source)
          const target = nodePositions.find((n) => n.id === e.target)

          if (!source?.x || !source?.y || !target?.x || !target?.y) return null

          return (
            <CourseEdge
              key={`${e.source}-${e.target}`}
              sourcePosition={{ x: source.x, y: source.y }}
              targetPosition={{ x: target.x, y: target.y }}
            />
          )
        })}
      </svg>

      {nodePositions.map((np) => {
        if (!np.x || !np.y) return null
        return (
          <CourseNode key={np.id} id={np.id} position={{ x: np.x, y: np.y }} />
        )
      })}
    </div>
  )
}

type CourseNodeProps = {
  id: string
  position: { x: number; y: number }
}

function CourseNode({ id, position }: CourseNodeProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: 'translate(-50%, -50%)',
      }}
      className="border px-5 py-2 rounded-xl shadow-sm font-semibold bg-white hover:bg-slate-200 transition-all cursor-pointer"
    >
      {id}
    </div>
  )
}

type CourseEdgeProps = {
  sourcePosition: { x: number; y: number }
  targetPosition: { x: number; y: number }
}

function CourseEdge({ sourcePosition, targetPosition }: CourseEdgeProps) {
  return (
    <line
      x1={sourcePosition.x}
      y1={sourcePosition.y - 20}
      x2={targetPosition.x}
      y2={targetPosition.y}
      stroke="black"
      strokeWidth="2"
      className="transition"
    />
  )
}
