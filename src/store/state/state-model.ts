import { EmptyFees, StateModelIF } from '@/interfaces'
import { cloneDeep } from 'lodash'
import { getCustodialRecordsResources } from '@/store/getters'

export const stateModel: StateModelIF = {
  currentJsDate: null,
  tombstone: {
    authRoles: [],
    filingType: null,
    legalName: '',
    userEmail: '',
    userPhone: '',
    userFirstName: '',
    userLastName: '',
    userKeycloakGuid: null,
    userAddress: null,
    folioNumber: '',
    transactionalFolioNumber: '',
    transactionalFolioNumberValid: false
  },
  business: {
    businessId: '',
    legalName: '',
    businessContact: {
      email: '',
      confirmEmail: '',
      phone: ''
    },
    officeAddress: {
      mailingAddress: {
        addressCity: '',
        addressCountry: '',
        addressRegion: '',
        postalCode: '',
        streetAddress: ''
      },
      deliveryAddress: {
        addressCity: '',
        addressCountry: '',
        addressRegion: '',
        postalCode: '',
        streetAddress: ''
      }
    }
  },
  businessContact: {
    email: '',
    confirmEmail: '',
    phone: ''
  },
  dissolution: {
    dissolutionType: null,
    dissolutionDate: '',
    dissolutionStatementStep: {
      valid: false,
      dissolutionStatementType: null
    },
    hasCertificateDestroyed: false,
    custodianOfRecords: {
      valid: false,
      custodian: {
        officer: {
          firstName: '',
          lastName: '',
          middleName: '',
          email: '',
          organizationName: '',
          partyType: null
        },
        mailingAddress: {
          addressCity: '',
          addressCountry: '',
          addressRegion: '',
          postalCode: '',
          streetAddress: '',
          deliveryInstructions: ''
        },
        deliveryAddress: {
          addressCity: '',
          addressCountry: '',
          addressRegion: '',
          postalCode: '',
          streetAddress: '',
          deliveryInstructions: ''
        },
        roles: [
          {
            roleType: null,
            appointmentDate: ''
          }
        ],
        inheritMailingAddress: false // draft only property
      }
    }
  },
  accountInformation: {
    accountType: '',
    id: null,
    label: '',
    type: ''
  },
  nameRequest: {
    nrNumber: '',
    entityType: '',
    details: {},
    applicant: {},
    filingId: null
  },
  nameTranslations: [],
  currentDate: '',
  effectiveDateTime: {
    valid: false,
    isFutureEffective: null,
    effectiveDate: null
  },
  certifyState: {
    valid: false,
    certifiedBy: ''
  },
  documentDelivery: {
    documentOptionalEmail: '',
    valid: true
  },
  tempId: '',
  entityType: null,
  currentStep: 1,
  filingId: 0,
  isSaving: false,
  isSavingResuming: false,
  isFilingPaying: false,
  ignoreChanges: false,
  haveChanges: false,
  defineCompanyStep: {
    valid: false,
    cooperativeType: null,
    officeAddresses: {}
  },
  addPeopleAndRoleStep: {
    valid: false,
    orgPeople: []
  },
  createShareStructureStep: {
    valid: false,
    shareClasses: []
  },
  createRulesStep: {
    validationDetail: {
      valid: false,
      validationItemDetails: []
    },
    rulesConfirmed: false,
    rulesDoc: null,
    docKey: null
  },
  incorporationAgreementStep: {
    valid: false,
    agreementType: null
  },
  createMemorandumStep: {
    validationDetail: {
      valid: false,
      validationItemDetails: []
    },
    memorandumConfirmed: false,
    memorandumDoc: null,
    docKey: null
  },
  uploadAffidavitStep: {
    validationDetail: {
      valid: false,
      validationItemDetails: []
    },
    affidavitConfirmed: false,
    affidavitDoc: null,
    docKey: null
  },
  createResolutionStep: {
    validationDetail: {
      valid: false,
      validationItemDetails: []
    },
    resolutionConfirmed: false
  },
  validateSteps: false,
  showErrors: false,
  feePrices: [cloneDeep(EmptyFees)],
  staffPaymentStep: {
    valid: false,
    staffPayment: {
      option: NaN,
      routingSlipNumber: '',
      bcolAccountNumber: '',
      datNumber: '',
      folioNumber: '',
      isPriority: false
    }
  },
  courtOrderStep: {
    valid: false,
    courtOrder: {
      fileNumber: '',
      hasPlanOfArrangement: null
    }
  }
}
