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
  return <div className="g-client-work-background">{children}</div>
}

const ClientWorkContent = () => {
  return (
    <div>
      <h2 className="g-heading-1  g-text-shadow-primary text-center ">Recent Client Work</h2>

      <div className="grid lg:grid-cols-5 gap-6">
        <CardPresentation2
          classes="h-[350px] lg:col-span-3"
          title="Stock Tracker"
          description="Cloud based financial application to research publicly listed companies, visualize its financial statements with real time price updates, paper trading and portfolio management. "
        >
          <img
            loading="lazy"
            src="/client-work/stock-tracker/st_1.png"
            alt="Stock Tracker Image"
            className="w-[420px] rounded-lg absolute -top-3 -left-4 shadow-2xl"
          />
          <img
            loading="lazy"
            src="/client-work/stock-tracker/st_3.png"
            alt="Stock Tracker Image"
            className="h-[220px] rounded-lg absolute left-[20%] top-32 shadow-2xl"
          />
          <img
            loading="lazy"
            src="/client-work/stock-tracker/st_4.png"
            alt="Stock Tracker Image"
            className="h-[250px] rounded-lg absolute right-[15%] top-2 shadow-2xl"
          />
          <img
            loading="lazy"
            src="/client-work/stock-tracker/st_2.png"
            alt="Stock Tracker Image"
            className="h-[270px] rounded-lg absolute right-0 top-[70px] shadow-2xl"
          />
        </CardPresentation2>

        <CardPresentation2
          classes="h-[350px] lg:h-[724px] lg:row-span-2 lg:col-span-2"
          title="Wealth Tracker"
          description="Money management system to keep track of your personal wealth, that includes personal finances marked with tags and monitoring investment portfolios, project is in development"
        >
          <img
            loading="lazy"
            src="/client-work/wealth-tracker/wt_desktop_1.png"
            alt="Stock Tracker Image"
            className="min-h-[220px] w-full object-cover rounded-lg absolute -left-4 top-0 shadow-2xl"
          />
          <img
            loading="lazy"
            src="/client-work/wealth-tracker/wt_desktop_2.png"
            alt="Stock Tracker Image"
            className="min-h-[240px] w-full object-cover rounded-lg absolute -right-4 top-[220px] shadow-2xl"
          />
          <img
            loading="lazy"
            src="/client-work/wealth-tracker/wt_mobile.png"
            alt="Stock Tracker Image"
            className="min-h-[220px] max-h-[360px] object-cover rounded-lg absolute -left-4 top-[320px] shadow-2xl"
          />
        </CardPresentation2>

        <CardPresentation2
          classes="h-[350px] lg:col-span-3"
          title="Simple Desk"
          description="An internal issue-tracking system, similar to Jira where users can create customized tickets for a specific department. Project Included assignment prioritization, live communication, permission modification, and user monitoring."
        >
          <img
            loading="lazy"
            src="/client-work/simple-desk/sd_1.png"
            alt="Simple Desk Image"
            className="h-[270px] rounded-lg absolute right-0 top-0 shadow-2xl"
          />
        </CardPresentation2>
      </div>
    </div>
  )
}
