import type { ContentProjectionProps } from '../../models'
import { CardPresentation2 } from '../shared/card-presentation-2'

export const ClientWorkPage = () => {
  return (
    <div className="relative">
      <ClientWorkBackground>
        <div className="g-layout-1">
          <ClientWorkContent></ClientWorkContent>
        </div>
      </ClientWorkBackground>
    </div>
  )
}

const ClientWorkBackground = ({ children }: ContentProjectionProps) => {
  return (
    <div className="g-client-work-background">
      {/* content */}
      {children}
    </div>
  )
}

const ClientWorkContent = () => {
  return (
    <div>
      <h2 className="g-heading-1  g-text-shadow-primary text-center mb-12">Recent Client Work</h2>

      <div className="grid lg:grid-cols-5 gap-6">
        <CardPresentation2
          classes="h-[350px] col-span-3"
          title="Stock Tracket"
          description="Cloud based financial application to research publicly listed companies, visualize its financial statements with real time price updates, paper trading and portfolio management. "
        >
          <img
            src="/client-work/st_1.png"
            alt="Stock Tracker Image"
            className="w-[420px] rounded-lg absolute -top-3 -left-4 shadow-2xl"
          />
          <img
            src="/client-work/st_3.png"
            alt="Stock Tracker Image"
            className="h-[220px] rounded-lg absolute left-[20%] top-32 shadow-2xl"
          />
          <img
            src="/client-work/st_4.png"
            alt="Stock Tracker Image"
            className="h-[250px] rounded-lg absolute right-[15%] top-2 shadow-2xl"
          />
          <img
            src="/client-work/st_2.png"
            alt="Stock Tracker Image"
            className="h-[270px] rounded-lg absolute right-0 top-[70px] shadow-2xl"
          />
        </CardPresentation2>

        <CardPresentation2
          classes="h-[724px] row-span-2 col-span-2"
          title="Stock Tracket"
          description="Cloud based financial application to research publicly listed companies, visualize its financial statements with real time price updates, paper trading and portfolio management. "
        >
          <div className="relative"></div>
        </CardPresentation2>

        <CardPresentation2
          classes="h-[350px] col-span-3"
          title="Stock Tracket"
          description="Cloud based financial application to research publicly listed companies, visualize its financial statements with real time price updates, paper trading and portfolio management. "
        >
          <div className="relative"></div>
        </CardPresentation2>
      </div>
    </div>
  )
}
