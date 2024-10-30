import * as React from 'react';
import { cn } from '@/lib/utils';

interface BreadcrumbProps extends React.ComponentPropsWithoutRef<'nav'> {
  children:
    | React.ReactElement<typeof BreadcrumbItem>
    | Array<React.ReactElement<typeof BreadcrumbItem>>;
  separator?: React.ReactNode;
}

const BreadcrumbContext = React.createContext<boolean>(false);

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, children, separator, ...props }, ref) => {
    const validChildren = getValidChildren(children);
    const count = validChildren.length;

    const clones = validChildren.map((child, index) =>
      React.cloneElement(child, {
        separator,
        isLastChild: count === index + 1,
      })
    );

    return (
      <BreadcrumbContext.Provider value={true}>
        <nav ref={ref} aria-label="breadcrumb" className={className} {...props}>
          <ol className={cn('flex')}>{clones}</ol>
        </nav>
      </BreadcrumbContext.Provider>
    );
  }
);
Breadcrumb.displayName = 'Breadcrumb';

interface InternalBreadcrumbItemProps {
  separator?: React.ReactNode;
  isLastChild: boolean;
}

type BreadcrumbItemProps = Omit<
  React.ComponentPropsWithoutRef<'li'>,
  keyof InternalBreadcrumbItemProps
> &
  Partial<InternalBreadcrumbItemProps> & {
    newProp?: string;
  };

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, children, separator, isLastChild, ...props }, ref) => {
    const isInsideBreadcrumb = React.useContext(BreadcrumbContext);

    if (!isInsideBreadcrumb) {
      throw new Error(
        `${BreadcrumbItem.displayName} must be used within ${Breadcrumb.displayName}.`
      );
    }

    return (
      <li ref={ref} className={cn('group', className)} {...props}>
        {children}
        {!isLastChild && (
          <span className="mx-2 *:!inline-block">{separator ?? '/'}</span>
        )}
      </li>
    );
  }
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

const getValidChildren = (children: React.ReactNode): React.ReactElement[] => {
  return React.Children.toArray(children).filter(
    (child): child is React.ReactElement => {
      if (React.isValidElement(child) && child.type === BreadcrumbItem) {
        return true;
      }
      throw new Error(
        `${Breadcrumb.displayName} can only have ${BreadcrumbItem.displayName} as children.`
      );
    }
  );
};

export { Breadcrumb, BreadcrumbItem };
