import type { CommercialOrder, ProductionStep } from './com.types';

export interface FinancialProjection {
  orderTotal: number;
  totalPaid: number;
  outstandingBalance: number;
  requiredAdvanceAmount: number; // REFINEMENT 6
  isAdvanceMet: boolean;
  isFullyPaid: boolean;
}

export interface WorkflowProjection {
  totalSteps: number;
  completedSteps: number;
  progressPercentage: number;
  currentStep: ProductionStep | null; // REFINEMENT 7
}

export const projectFinancials = (order: CommercialOrder): FinancialProjection => {
  const orderTotal = order.agreement.financials.unitPrice * order.agreement.financials.quantity;
  const totalPaid = order.ledger.reduce((sum, entry) => sum + entry.amount, 0);
  const outstandingBalance = Math.max(0, orderTotal - totalPaid);
  
  const requiredAdvanceAmount = orderTotal * (order.agreement.financials.requiredAdvancePercentage / 100);
  const isAdvanceMet = totalPaid >= requiredAdvanceAmount;

  return { orderTotal, totalPaid, outstandingBalance, requiredAdvanceAmount, isAdvanceMet, isFullyPaid: outstandingBalance === 0 };
};

export const projectWorkflow = (order: CommercialOrder): WorkflowProjection => {
  const steps = order.workflow.steps;
  const totalSteps = steps.length;
  const completedSteps = steps.filter(s => s.status === 'COMPLETED').length;
  
  const currentStep = steps.find(s => s.status === 'IN_PROGRESS') || steps.find(s => s.status === 'PENDING') || null;

  return { totalSteps, completedSteps, progressPercentage: totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100), currentStep };
};