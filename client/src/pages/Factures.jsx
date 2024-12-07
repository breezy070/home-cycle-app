

export default function Factures() {
  return (
    <div>
      <div className='flex flex-col'>
        <h2 className='text-3xl text-start font-semibold p-10'>Mes Factures</h2>
        <div className='flex flex-col gap-10 p-10'>
          <div className='flex flex-row gap-10 w-full bg-slate-200 rounded-xl p-5'>
            <img src="src/assets/technician1.jpg" alt="" className='object-cover max-w-44 max-h-44 rounded-xl'/>
            <div className='flex flex-col justify-between w-full'>
              <h3 className='text-2xl'>Nom de l'Intervenant: Saul Lima</h3>
              <p>Date Achat: 06/12/2024 à 15:00 heures</p>
              <p>Description : Réparation vélo à domicile</p>
              <p>Status: Payé</p>
            </div>
            <div className="flex w-full justify-end">
                <div className="flex flex-col justify-end gap-3">
                    <button className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12'>Consulter Facture</button>
                </div>
            </div>
          </div>
          <div className='flex flex-row gap-10 w-full bg-slate-200 rounded-xl p-5'>
            <img src="src/assets/technician2.jpg" alt="" className='object-cover max-w-44 max-h-44 rounded-xl'/>
            <div className='flex flex-col justify-between w-full'>
            <h3 className='text-2xl'>Nom de l'Intervenant: Nico Dober</h3>
              <p>Date Achat: 06/12/2024 à 15:00 heures</p>
              <p>Description : Manutention vélo à domicile</p>
              <p>Status: Payé</p>
            </div>
            <div className="flex w-full justify-end">
                <div className="flex flex-col justify-end gap-3">
                    <button className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12'>consulter facture</button>
                </div>
            </div>
          </div>
          <div className='flex flex-row gap-10 w-full bg-slate-200 rounded-xl p-5'>
            <img src="src/assets/technician3.png" alt="" className='object-cover max-w-44 max-h-44 rounded-xl'/>
            <div className='flex flex-col justify-between w-full'>
              <h3 className='text-2xl'>Josh Brown</h3>
              <p>Date Achat: 06/12/2024 à 15:00 heures</p>
              <p>Description : Livraison pièces détachées vélo à domicile</p>
              <p>Status: Payé</p>
            </div>
            <div className="flex w-full justify-end">
                <div className="flex flex-col justify-end gap-3">
                    <button className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12'>consulter facture</button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
