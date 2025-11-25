'use client'

interface DynamicTableProps {
  data: {
    tableType: 'pricing' | 'comparison' | 'data'
    columns: string[]
    rows: Array<{
      cells: string[]
    }>
  }
}

export default function DynamicTable({ data }: DynamicTableProps) {
  const getTableStyle = () => {
    switch (data.tableType) {
      case 'pricing':
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }
      case 'comparison':
        return {
          background: '#f9fafb',
          color: '#374151'
        }
      default:
        return {
          background: 'white',
          color: '#374151'
        }
    }
  }

  return (
    <div style={{ padding: '2rem', overflow: 'auto' }}>
      <div style={{ 
        ...getTableStyle(),
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {data.columns.map((column, index) => (
                <th
                  key={index}
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    borderBottom: data.tableType === 'pricing' ? '2px solid rgba(255,255,255,0.2)' : '2px solid #e5e7eb'
                  }}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                style={{
                  borderBottom: data.tableType === 'pricing' ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb'
                }}
              >
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    style={{
                      padding: '1rem',
                      verticalAlign: 'top'
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}