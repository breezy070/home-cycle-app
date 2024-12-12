import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';

export default function ListBox({ technicians, selectedTechnician, onSelectTechnician }) {
  console.log(technicians)
  console.log(selectedTechnician)
  return (
    <div className="flex flex-row items-center justify-center gap-3 w-full mx-auto p-2">
      <Listbox
        value={selectedTechnician?._id || ''}
        onChange={(technicianId) => {
          const technician = technicians.find((tech) => tech._id === technicianId);
          onSelectTechnician(technician); // Notify parent of selection
        }}
        className="z-[10000] w-52 text-center"
      >
        <div className="relative">
          <ListboxButton className="w-full py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none text-center">
            <div className='flex flex-row gap-2 justify-center items-center align-middle'>
              {/* <img src={selectedTechnician ? selectedTechnician.profilePicture : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} alt="" className='h-7 w-7 rounded-full object-cover cursor-pointer'/> */}
              {selectedTechnician ? <img className='h-7 w-7 rounded-full object-cover cursor-pointer' src={selectedTechnician.profilePicture} alt="" /> : ''}
              <p className=''>{selectedTechnician ? selectedTechnician.first_name : 'Technician Zones'}</p>
            </div>
          </ListboxButton>
          <ListboxOptions className="absolute mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
          <ListboxOption
              className={({ active }) =>
                `cursor-pointer select-none relative py-2 px-4 ${
                  active ? 'bg-blue-500 text-white' : 'text-gray-900'
                }`
              }
            >
              <div className="flex flex-row align-middle items-center gap-3 justify-center rounded-lg w-full">
                
                <div className="w-1/2">Show All Technicians</div>
              </div>
            </ListboxOption>
            {technicians.map((technician) => (
              <ListboxOption
                key={technician._id}
                value={technician._id}
                className={({ active }) =>
                  `cursor-pointer select-none relative py-2 px-4 ${
                    active ? 'bg-blue-500 text-white' : 'text-gray-900'
                  }`
                }
              >
                <div className='flex flex-row align-middle items-center gap-3 justify-center rounded-lg w-full'>
                  <div className='w-1/2'>{technician.first_name}</div>
                  <img src={technician.profilePicture} alt="" className='h-7 w-7 rounded-full object-cover cursor-pointer'/>
                </div>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
