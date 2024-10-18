const courseGraph: { [key: string]: Course } = {
  CS116: {
    id: 'CS116',
    position: { x: 100, y: 50 },
    prerequisites: [],
  },
  CS117: {
    id: 'CS117',
    position: { x: 100, y: 150 },
    prerequisites: ['CS116'],
  },
  CS263: {
    id: 'CS263',
    position: { x: 100, y: 250 },
    prerequisites: ['CS117'],
  },
}

export default function App() {
  return (
    <div className="h-screen w-screen">
      {Object.entries(courseGraph).map(([key, course]) => {
        return (
          <CourseNode key={key} id={course.id} position={course.position} />
        )
      })}

      <svg className="h-full w-full">
        {Object.entries(courseGraph).map(([key, course]) => {
          if (course.prerequisites.length === 0) return null

          return course.prerequisites.map((preReqId) => {
            const prereqCourse = courseGraph[preReqId]
            return (
              <CourseEdge
                key={`${key}-${preReqId}`}
                sourcePosition={prereqCourse.position}
                targetPosition={course.position}
              />
            )
          })
        })}
      </svg>
    </div>
  )
}

type Course = {
  id: string
  position: { x: number; y: number }
  prerequisites: string[]
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
