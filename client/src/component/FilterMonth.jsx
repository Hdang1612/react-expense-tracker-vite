import { useState } from 'react'

const FilterContainer = ({ onFilter }) => {
  const [month, setMonth] = useState('Nov')

  const handleFilter = () => {
    onFilter(month)
  }

  const allMonths = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  return (
    <div className=' flex mb-4 w-full'>
      <select
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className='border p-2 w-1/3 '
      >
        {allMonths.map((monthOption) => (
          <option key={monthOption} value={monthOption}>
            {monthOption}
          </option>
        ))}
      </select>
      <button
        onClick={handleFilter}
        className='ml-2 w-2/3 p-2 bg-[#EF8767] text-white text-xl rounded-full '
      >
        Filter
      </button>
    </div>
  )
}

export default FilterContainer
