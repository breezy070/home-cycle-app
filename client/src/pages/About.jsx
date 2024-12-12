


export default function About() {
  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-600">About Our Web App</h1>
          <p className="text-lg text-gray-600 mt-2">
            Making bike repairs and parts purchases seamless and efficient.
          </p>
        </header>

        {/* About Section */}
        <section className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">What We Do</h2>
          <p className="text-gray-600">
            Our service connects <span className="font-semibold">clients</span>,
            and{" "}
            <span className="font-semibold">technicians</span> to make bike repairs and part purchases simple and convenient. Clients can book appointments for a technician to visit their home and repair their bike or purchase parts like brakes, tires, and more.
          </p>
        </section>

        {/* Features Section */}
        <section className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Key Features</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            {/* <li>
              <span className="font-semibold">Interactive Map:</span> Admins can assign geographical zones to technicians for efficient appointment scheduling.
            </li> */}
            <li>
              <span className="font-semibold">Location-Based Technician Assignment:</span> Technicians are automatically assigned based on their availability and the user's location within their zone.
            </li>
            {/* <li>
              <span className="font-semibold">User-Friendly Dashboards:</span> Technicians can view and manage their scheduled appointments, while users can track their upcoming bookings.
            </li> */}
            <li>
              <span className="font-semibold">Personalized Experience:</span> A technician available close to you.
            </li>
          </ul>
        </section>

        {/* Mission Section */}
        <section className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Mission</h2>
          <p className="text-gray-600">
            Our mission is to enhance convenience for bike owners by providing an integrated solution for on-site repairs and parts purchases. We aim to save time, reduce hassle, and improve communication between our clients and technicians.
          </p>
        </section>

        {/* Why Choose Us Section */}
        <section className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Why Choose Us?</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>
              <span className="font-semibold">Effortless Scheduling:</span> Easy-to-use booking process for clients.
            </li>
            {/* <li>
              <span className="font-semibold">Efficiency for Technicians:</span> Manage appointments and zones effectively.
            </li> */}
            {/* <li>
              <span className="font-semibold">Interactive Admin Tools:</span> Flexible tools for managing zones and technician assignments.
            </li> */}
            <li>
              <span className="font-semibold">Seamless Experience:</span> A unified platform for all your bike repair needs.
            </li>
          </ul>
        </section>

        {/* Footer */}
        <footer className="text-center mt-8">
          <p className="text-gray-500">
            &copy; 2024 HomeCycleHome. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}
