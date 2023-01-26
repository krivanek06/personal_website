import { ProvidingServicesBackground } from './providing-services-background'
import { ProvidingServicesContent } from './providing-services-content'

export const ProvidingServicesPage = () => {
  return (
    <div className="relative">
      <ProvidingServicesBackground>
        <div className="g-layout-1">
          <ProvidingServicesContent></ProvidingServicesContent>
        </div>
      </ProvidingServicesBackground>
    </div>
  )
}
