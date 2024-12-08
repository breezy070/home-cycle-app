import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';

export default function ListBox({ technicians, selectedTechnician, onSelectTechnician }) {
  return (
    <div className="flex flex-row items-center justify-center gap-3 w-full mx-auto p-2">
      <div>
        <h2>Select a Technician</h2>
      </div>
      <Listbox
        value={selectedTechnician?._id || ''}
        onChange={(technicianId) => {
          const technician = technicians.find((tech) => tech._id === technicianId);
          onSelectTechnician(technician); // Notify parent of selection
        }}
        className="z-[10000] w-44 text-center"
      >
        <div className="relative">
          <ListboxButton className="w-full py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none text-center">
            {selectedTechnician ? selectedTechnician.first_name : 'Select a Technician'}
          </ListboxButton>
          <ListboxOptions className="absolute mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
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
                {technician.first_name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
