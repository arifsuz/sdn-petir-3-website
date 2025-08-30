export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container py-8 grid md:grid-cols-3 gap-8">
        <div>
          <div className="font-semibold text-lg">SDN Petir 3</div>
          <p className="text-sm text-gray-600 mt-2">
            Jl. KH. Ahmad Dahlan No.59, Petir, Kec. Cipondoh, Kota Tangerang, Banten 15147
          </p>
        </div>
        <div>
          <div className="font-semibold">Kontak</div>
          <ul className="mt-2 text-sm text-gray-600">
            <li>Email: sdnpetir3@example.sch.id</li>
            <li>Telepon: (021) 000-000</li>
          </ul>
        </div>
        <div className="text-sm text-gray-600">
          © {new Date().getFullYear()} SDN Petir 3. Seluruh hak cipta dilindungi.
        </div>
      </div>
    </footer>
  )
}
