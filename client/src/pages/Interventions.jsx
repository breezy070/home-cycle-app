

export default function Interventions() {
  return (
    <div>
      <div className='flex flex-col'>
        <div className="flex flex-row w-full justify-center">
            <button className='bg-purple-600 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12'>Prendre Rendez-vous</button>
        </div>
        <h2 className='text-3xl text-start font-semibold p-10'>Mes Interventions</h2>
        <div className='flex flex-col gap-10 p-10'>
          <div className='flex flex-row gap-10 w-full bg-slate-200 rounded-xl p-5'>
            <img src="src/assets/technician1.jpg" alt="" className='object-cover max-w-44 max-h-44 rounded-xl'/>
            <div className='flex flex-col justify-between w-full'>
              <h3 className='text-2xl'>Saul Lima</h3>
              <p>Date: 07/12/2024 à 15:00 heures</p>
              <p>Détails: Réparation vélo à domicile</p>
            </div>
            <div className="flex w-full justify-end">
                <div className="flex flex-col justify-end gap-3">
                    <button className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12'>Modifier</button>
                    <button className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12'>Consulter Facture</button>
                    <button className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12'>Annuler Rendez-Vous</button>
                </div>
            </div>
          </div>
          <div className='flex flex-row gap-10 w-full bg-slate-200 rounded-xl p-5'>
            <img src="src/assets/technician2.jpg" alt="" className='object-cover max-w-44 max-h-44 rounded-xl'/>
            <div className='flex flex-col justify-between w-full'>
              <h3 className='text-2xl'>Nicolas Dober</h3>
              <p>Date: 07/12/2024 à 15:00 heures</p>
              <p>Manutention vélo à domicile</p>
            </div>
            <div className="flex w-full justify-end">
                <div className="flex flex-col justify-end gap-3">
                    <button className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12'>Modifier</button>
                    <button className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12'>consulter facture</button>
                    <button className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12'>annuler rendez-vous</button>
                </div>
            </div>
          </div>
          <div className='flex flex-row gap-10 w-full bg-slate-200 rounded-xl p-5'>
            <img src="src/assets/technician3.png" alt="" className='object-cover max-w-44 max-h-44 rounded-xl'/>
            <div className='flex flex-col justify-between w-full'>
              <h3 className='text-2xl'>Josh Brown</h3>
              <p>Date: 07/12/2024 à 15:00 heures</p>
              <p>livraison à domicile de pièces détachées</p>
            </div>
            <div className="flex w-full justify-end">
                <div className="flex flex-col justify-end gap-3">
                    <button className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12'>Modifier</button>
                    <button className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12'>consulter facture</button>
                    <button className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12'>annuler rendez-vous</button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
