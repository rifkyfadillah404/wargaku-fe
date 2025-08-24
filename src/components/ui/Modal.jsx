import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "./Button"

const Modal = ({ isOpen, onClose, children, className, ...props }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div
        className={cn(
          "relative bg-background border rounded-lg shadow-lg max-h-[90vh] overflow-hidden flex flex-col",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}

const ModalHeader = ({ children, className, onClose, ...props }) => (
  <div 
    className={cn("flex items-center justify-between p-6 border-b", className)} 
    {...props}
  >
    <div className="flex-1">{children}</div>
    {onClose && (
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose}
        className="h-6 w-6 rounded-full"
      >
        <X className="h-4 w-4" />
      </Button>
    )}
  </div>
)

const ModalTitle = ({ children, className, ...props }) => (
  <h2 
    className={cn("text-lg font-semibold", className)} 
    {...props}
  >
    {children}
  </h2>
)

const ModalDescription = ({ children, className, ...props }) => (
  <p 
    className={cn("text-sm text-muted-foreground", className)} 
    {...props}
  >
    {children}
  </p>
)

const ModalBody = ({ children, className, ...props }) => (
  <div
    className={cn("p-6 overflow-y-auto flex-1 min-h-0", className)}
    {...props}
  >
    {children}
  </div>
)

const ModalFooter = ({ children, className, ...props }) => (
  <div
    className={cn("flex items-center justify-end gap-2 p-6 border-t sticky bottom-0 bg-background", className)}
    {...props}
  >
    {children}
  </div>
)

export { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter }
