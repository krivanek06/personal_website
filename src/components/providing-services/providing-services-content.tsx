import { CardPresentation } from '../shared/card-presentation'

export const ProvidingServicesContent = () => {
  return (
    <div>
      <h2 className="text-center g-heading-2  g-text-shadow-primary">Providing Services</h2>

      <p className="my-10 w-8/12 text-center m-auto">
        Expert in Angular and NodeJS development, creating high-performance, scalable and secure apps tailored
        to unique business needs, modernizing legacy systems to stay on the cutting edge of technology.
      </p>

      {/* list of services */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        <CardPresentation
          title="Angular Development"
          img={{
            src: 'images/bg_angular.png',
            alt: 'Angular Service Image',
          }}
          description="Building high-performance, responsive, and dynamic Angular web applications using the latest technologies and industry best practices to ensure the highest quality and performance standards."
        />

        <CardPresentation
          title="NodeJS Development"
          img={{
            src: 'images/bg_nestjs.webp',
            alt: 'NestJS Service Image',
          }}
          description="Creating scalable GraphQL or REST API's using NestJS and NodeJS to build modular server-side applications that are easy to maintain, robust, high-performance, and secure. "
        />

        <CardPresentation
          title="Custom Web Solutions"
          img={{
            src: 'images/bg_web_solution.jpeg',
            alt: 'Web Solution Service Image',
          }}
          description="Each business has unique needs and a close relationship with clients is required to understand the problems and design a custom solution that fits their specific needs and to ensure that the enterprise software is modern, efficient, and able to meet the demands of your business"
        />

        <CardPresentation
          title="Software Modernization"
          img={{
            src: 'images/bg_software_modern.jpeg',
            alt: 'Software Modernization Service Image',
          }}
          description="Don't let legacy systems hold you back. Whether it's extending your existing system or replacing it with a more modern solution, the sole goal is to help you stay on the cutting edge of technology, upgrade your platform to unlock valuable innovation opportunities."
        />
      </div>
    </div>
  )
}
