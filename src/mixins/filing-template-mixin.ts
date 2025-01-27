// Libraries and mixins
import { Component, Mixins } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import { DateMixin } from '@/mixins'

// Interfaces
import {
  ActionBindingIF, BusinessContactIF, CertifyIF, CreateRulesIF, EffectiveDateTimeIF, DefineCompanyIF,
  DissolutionFilingIF, IncorporationAgreementIF, IncorporationFilingIF, NameTranslationIF, PeopleAndRoleIF,
  DocIF, ShareStructureIF, CreateMemorandumIF, BusinessIF, DissolutionStatementIF, UploadAffidavitIF,
  StaffPaymentStepIF, CourtOrderStepIF, CreateResolutionIF, DocumentDeliveryIF, OrgPersonIF
} from '@/interfaces'

// Constants and enums
import { INCORPORATION_APPLICATION } from '@/constants'
import { CorpTypeCd, DissolutionTypes, EffectOfOrders, FilingTypes, RoleTypes, StaffPaymentOptions } from '@/enums'

/**
 * Mixin that provides the integration with the Legal API.
 */
@Component({})
export default class FilingTemplateMixin extends Mixins(DateMixin) {
  @Getter isTypeBcomp!: boolean
  @Getter isTypeCoop!: boolean
  @Getter isNamedBusiness!: boolean
  @Getter getAffidavitStep!: UploadAffidavitIF
  @Getter getNameRequestNumber!: string
  @Getter getApprovedName!: string
  @Getter getBusiness!: BusinessIF
  @Getter getBusinessLegalName!: string
  @Getter getDissolutionType!: DissolutionTypes
  @Getter getTempId!: string
  @Getter getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter getEntityType!: CorpTypeCd
  @Getter getCurrentDate!: string
  @Getter getCertifyState!: CertifyIF
  @Getter getDefineCompanyStep!: DefineCompanyIF
  @Getter getNameTranslations!: NameTranslationIF[]
  @Getter getAddPeopleAndRoleStep!: PeopleAndRoleIF
  @Getter getCreateShareStructureStep!: ShareStructureIF
  @Getter getIncorporationAgreementStep!: IncorporationAgreementIF
  @Getter getBusinessContact!: BusinessContactIF
  @Getter getCreateRulesStep!: CreateRulesIF
  @Getter getCreateMemorandumStep!: CreateMemorandumIF
  @Getter getMemorandum!: any
  @Getter getCreateResolutionStep!: CreateResolutionIF
  @Getter getResolution!: any
  @Getter getBusinessId!: string
  @Getter getDocumentDelivery!: DocumentDeliveryIF
  @Getter getStaffPaymentStep!: StaffPaymentStepIF
  @Getter getCourtOrderStep!: CourtOrderStepIF
  @Getter isRoleStaff!: boolean
  @Getter getDissolutionStatementStep!: DissolutionStatementIF
  @Getter getCustodian!: OrgPersonIF
  @Getter getFolioNumber!: string
  @Getter getTransactionalFolioNumber!: string
  @Getter isPremiumAccount!: boolean

  @Action setAffidavit!: ActionBindingIF
  @Action setEntityType!: ActionBindingIF
  @Action setBusinessAddress!: ActionBindingIF
  @Action setBusinessContact!: ActionBindingIF
  @Action setDissolutionType!: ActionBindingIF
  @Action setLegalName!: ActionBindingIF
  @Action setCooperativeType!: ActionBindingIF
  @Action setOfficeAddresses!: ActionBindingIF
  @Action setNameTranslationState!: ActionBindingIF
  @Action setDefineCompanyStepValidity!: ActionBindingIF
  @Action setNameRequestState!: ActionBindingIF
  @Action setOrgPersonList!: ActionBindingIF
  @Action setCertifyState!: ActionBindingIF
  @Action setShareClasses!: ActionBindingIF
  @Action setEffectiveDate!: ActionBindingIF
  @Action setIsFutureEffective!: ActionBindingIF
  @Action setFolioNumber!: ActionBindingIF
  @Action setTransactionalFolioNumber!: ActionBindingIF
  @Action setIncorporationAgreementStepData!: ActionBindingIF
  @Action setRules!: ActionBindingIF
  @Action setMemorandum!: ActionBindingIF
  @Action setCourtOrderFileNumber!: ActionBindingIF
  @Action setHasPlanOfArrangement!: ActionBindingIF
  @Action setStaffPayment!: ActionBindingIF
  @Action setResolution!: ActionBindingIF
  @Action setDocumentOptionalEmail!: ActionBindingIF
  @Action setDissolutionStatementStepData!: ActionBindingIF
  @Action setCustodianOfRecords!: ActionBindingIF

  /**
   * Builds an incorporation filing from store data. Used when saving a filing.
   * @returns the filing body to save
   */
  buildIncorporationFiling (): IncorporationFilingIF {
    // Build the main filing.
    const filing: IncorporationFilingIF = {
      header: {
        name: INCORPORATION_APPLICATION,
        certifiedBy: this.getCertifyState.certifiedBy,
        date: this.getCurrentDate,
        folioNumber: this.getFolioNumber,
        isFutureEffective: this.getEffectiveDateTime.isFutureEffective
      },
      business: {
        legalType: this.getEntityType,
        identifier: this.getTempId
      },
      incorporationApplication: {
        nameRequest: {
          legalType: this.getEntityType
        },
        nameTranslations: this.getNameTranslations,
        offices: this.getDefineCompanyStep.officeAddresses,
        contactPoint: {
          email: this.getBusinessContact.email,
          phone: this.getBusinessContact.phone,
          ...this.getBusinessContact.extension
            ? { extension: +this.getBusinessContact.extension }
            : {}
        },
        parties: this.getAddPeopleAndRoleStep.orgPeople
      }
    }

    // Conditionally add the entity-specific sections.
    switch (this.getEntityType) {
      case CorpTypeCd.COOP:
        filing.incorporationApplication.cooperative = {
          cooperativeAssociationType: this.getDefineCompanyStep.cooperativeType,
          rulesFileKey: this.getCreateRulesStep.docKey || null,
          rulesFileName: this.getCreateRulesStep.rulesDoc?.name || null,
          rulesFileSize: this.getCreateRulesStep.rulesDoc?.size || null,
          rulesFileLastModified: this.getCreateRulesStep.rulesDoc?.lastModified || null,
          rulesConfirmed: this.getCreateRulesStep.rulesConfirmed || false,
          memorandumFileKey: this.getCreateMemorandumStep.docKey || null,
          memorandumFileName: this.getCreateMemorandumStep?.memorandumDoc?.name || null,
          memorandumFileSize: this.getCreateMemorandumStep?.memorandumDoc?.size || null,
          memorandumFileLastModified: this.getCreateMemorandumStep?.memorandumDoc?.lastModified || null,
          memorandumConfirmed: this.getCreateMemorandumStep.memorandumConfirmed || false
        }
        break
      case CorpTypeCd.BENEFIT_COMPANY:
      case CorpTypeCd.BC_CCC:
      case CorpTypeCd.BC_COMPANY:
      case CorpTypeCd.BC_ULC_COMPANY:
        filing.incorporationApplication.shareStructure = {
          shareClasses: this.getCreateShareStructureStep.shareClasses
        }
        filing.incorporationApplication.incorporationAgreement = {
          agreementType: this.getIncorporationAgreementStep.agreementType
        }
        break
    }

    // If this is a named IA then add Name Request Number and Approved Name.
    if (this.isNamedBusiness) {
      filing.incorporationApplication.nameRequest.nrNumber = this.getNameRequestNumber
      filing.incorporationApplication.nameRequest.legalName = this.getApprovedName
    }

    // If this is a future effective filing then save the effective date.
    if (this.getEffectiveDateTime.effectiveDate) {
      filing.header.effectiveDate =
        this.getEffectiveDateTime.effectiveDate && this.dateToApi(this.getEffectiveDateTime.effectiveDate)
    }

    return filing
  }

  /**
   * Parses a draft incorporation filing into the store. Used when loading a filing.
   * @param draftFiling the filing body to parse
   */
  parseIncorporationsDraft (draftFiling: any): void {
    // FUTURE: set types so each of these validate their parameters
    // ref: https://www.typescriptlang.org/docs/handbook/generics.html

    // NB: don't parse Name Request object -- NR is fetched from namex/NRO instead

    // restore Entity Type
    this.setEntityType(draftFiling.business.legalType)

    // restore Office Addresses
    this.setOfficeAddresses(draftFiling.incorporationApplication.offices)

    // restore Name Translations
    this.setNameTranslationState(draftFiling.incorporationApplication.nameTranslations || [])

    // restore Contact Info
    const draftContact = {
      ...draftFiling.incorporationApplication.contactPoint,
      confirmEmail: draftFiling.incorporationApplication.contactPoint.email
    }
    this.setBusinessContact(draftContact)

    // restore Persons and Organizations
    this.setOrgPersonList(draftFiling.incorporationApplication.parties)

    // conditionally restore the entity-specific sections
    switch (this.getEntityType) {
      case CorpTypeCd.COOP:
        // restore Cooperative type
        this.setCooperativeType(draftFiling.incorporationApplication.cooperative?.cooperativeAssociationType)

        // restore Rules
        let rulesDoc: DocIF = null
        if (draftFiling.incorporationApplication.cooperative?.rulesFileKey) {
          rulesDoc = {
            name: draftFiling.incorporationApplication.cooperative?.rulesFileName,
            lastModified: draftFiling.incorporationApplication.cooperative?.rulesFileLastModified,
            size: draftFiling.incorporationApplication.cooperative?.rulesFileSize
          }
        }
        const createRules: CreateRulesIF = {
          validationDetail: {
            valid: false,
            validationItemDetails: []
          },
          rulesConfirmed: draftFiling.incorporationApplication.cooperative?.rulesConfirmed,
          rulesDoc: rulesDoc,
          docKey: draftFiling.incorporationApplication.cooperative?.rulesFileKey
        }
        this.setRules(createRules)

        // restore Memorandum
        let memorandumDoc: DocIF = null
        if (draftFiling.incorporationApplication.cooperative?.memorandumFileKey) {
          memorandumDoc = {
            name: draftFiling.incorporationApplication.cooperative?.memorandumFileName,
            lastModified: draftFiling.incorporationApplication.cooperative?.memorandumFileLastModified,
            size: draftFiling.incorporationApplication.cooperative?.memorandumFileSize
          }
        }
        const createMemorandum: CreateMemorandumIF = {
          validationDetail: {
            valid: false,
            validationItemDetails: []
          },
          memorandumConfirmed: draftFiling.incorporationApplication.cooperative?.memorandumConfirmed,
          memorandumDoc: memorandumDoc,
          docKey: draftFiling.incorporationApplication.cooperative?.memorandumFileKey
        }
        this.setMemorandum(createMemorandum)

        break
      case CorpTypeCd.BENEFIT_COMPANY:
      case CorpTypeCd.BC_CCC:
      case CorpTypeCd.BC_COMPANY:
      case CorpTypeCd.BC_ULC_COMPANY:
        // restore Share Structure
        this.setShareClasses(draftFiling.incorporationApplication.shareStructure
          ? draftFiling.incorporationApplication.shareStructure.shareClasses : [])

        // restore Incorporation Agreement
        this.setIncorporationAgreementStepData({
          agreementType: draftFiling.incorporationApplication.incorporationAgreement?.agreementType
        })

        break
    }

    // restore Certify state
    this.setCertifyState({
      valid: false,
      certifiedBy: draftFiling.header.certifiedBy
    })

    // restore Future Effective data
    if (draftFiling.header.isFutureEffective) {
      this.setIsFutureEffective(true)
      const effectiveDate = this.apiToDate(draftFiling.header.effectiveDate)
      // Check that Effective Date is in the future, to improve UX and
      // to work around the default effective date set by the back end.
      if (effectiveDate >= this.getCurrentJsDate) this.setEffectiveDate(effectiveDate)
    }

    // NB: do not restore/overwrite Folio Number - just use the FN from auth info (see App.vue)
  }

  /**
   * Builds a dissolution filing from store data. Used when saving a filing.
   * @returns the filing body to save
   */
  buildDissolutionFiling (): DissolutionFilingIF {
    // Build the main filing.
    const filing: DissolutionFilingIF = {
      header: {
        name: FilingTypes.DISSOLUTION,
        certifiedBy: this.getCertifyState.certifiedBy,
        date: this.getCurrentDate,
        folioNumber: this.getFolioNumber, // default FN; may be overwritten by Transactional FN or staff BCOL FN
        isFutureEffective: null
      },
      business: {
        legalType: this.getEntityType,
        identifier: this.getBusinessId,
        legalName: this.getBusinessLegalName
      },
      dissolution: {
        dissolutionDate: this.getCurrentDate,
        affidavitConfirmed: this.getAffidavitStep.validationDetail.validationItemDetails[0]?.valid || false,
        custodialOffice: this.getBusiness.officeAddress,
        dissolutionType: this.getDissolutionType,
        parties: [{
          ...this.getCustodian,
          roles: [
            {
              roleType: RoleTypes.CUSTODIAN,
              appointmentDate: this.getCurrentDate
            }
          ]
        }]
      }
    }

    // Conditionally add the entity-specific sections.
    switch (this.getEntityType) {
      case CorpTypeCd.COOP:
        filing.dissolution = { ...filing.dissolution,
          dissolutionStatementType: this.getDissolutionStatementStep.dissolutionStatementType || null,
          affidavitFileKey: this.getAffidavitStep.docKey || null,
          affidavitFileName: this.getAffidavitStep.affidavitDoc?.name || null,
          affidavitFileSize: this.getAffidavitStep.affidavitDoc?.size || null,
          affidavitFileLastModified: this.getAffidavitStep.affidavitDoc?.lastModified || null,
          specialResolution: {
            resolutionConfirmed: this.getCreateResolutionStep.resolutionConfirmed || false,
            resolution: 'voluntary dissolution'
          }
        }
        break
      case CorpTypeCd.BENEFIT_COMPANY:
      case CorpTypeCd.BC_CCC:
      case CorpTypeCd.BC_COMPANY:
      case CorpTypeCd.BC_ULC_COMPANY:
        filing.dissolution = { ...filing.dissolution,
          resolution: {
            resolutionConfirmed: this.getCreateResolutionStep.resolutionConfirmed || false
          }
        }
        break
    }

    // If this is a future effective filing then save the effective date (all except Coop).
    if (this.getEffectiveDateTime.isFutureEffective === true) filing.header.isFutureEffective = true
    if (this.getEffectiveDateTime.isFutureEffective === false) filing.header.isFutureEffective = false
    if (this.getEffectiveDateTime.isFutureEffective && !this.isTypeCoop) {
      const effectiveDate = this.getEffectiveDateTime.effectiveDate
      if (effectiveDate) filing.header.effectiveDate = this.dateToApi(effectiveDate)
    }

    // Add Court Order ONLY when it is required and applied.
    const courtOrder = this.getCourtOrderStep.courtOrder
    if (courtOrder.hasPlanOfArrangement || courtOrder.fileNumber) {
      filing.dissolution.courtOrder = {
        fileNumber: courtOrder.fileNumber,
        effectOfOrder: courtOrder.hasPlanOfArrangement ? EffectOfOrders.PLAN_OF_ARRANGEMENT : null,
        hasPlanOfArrangement: courtOrder.hasPlanOfArrangement
      }
    }

    // NB: Staff role is mutually exclusive with premium account.
    if (this.isRoleStaff) {
      if (this.getDocumentDelivery.documentOptionalEmail) {
        filing.header.documentOptionalEmail = this.getDocumentDelivery.documentOptionalEmail
      }

      // Add staff payment data.
      this.buildStaffPayment(filing)
    }

    // NB: Premium account is mutually exclusive with staff role.
    if (this.isPremiumAccount) {
      // override Folio Number if TFN exists and is different than default FN
      // also save a flag to correctly restore a draft later
      const fn = this.getFolioNumber
      const tfn = this.getTransactionalFolioNumber
      if (tfn && tfn !== fn) {
        filing.header.folioNumber = tfn
        filing.header.isTransactionalFolioNumber = true
      }
    }

    return filing
  }

  /**
   * Parses a draft dissolution filing into the store. Used when loading a filing.
   * @param draftFiling the filing body to parse
   */
  parseDissolutionDraft (draftFiling: any): void {
    // restore Business data
    this.setEntityType(draftFiling.business.legalType)
    this.setLegalName(draftFiling.business.legalName)

    // restore Dissolution data
    this.setBusinessAddress(draftFiling.dissolution.custodialOffice)
    this.setDissolutionType(draftFiling.dissolution.dissolutionType)

    // dissolution statement only exists for COOPS
    // for others this will be null/undefined but it isn't used anyway
    this.setDissolutionStatementStepData({
      valid: !!draftFiling.dissolution?.dissolutionStatementType,
      dissolutionStatementType: draftFiling.dissolution?.dissolutionStatementType
    })

    // take the first party, as there is only a single custodian in a dissolution filing
    if (draftFiling.dissolution.parties) {
      this.setCustodianOfRecords(draftFiling.dissolution.parties[0])
    }

    // restore Resolution data
    const createResolution: CreateResolutionIF = {
      validationDetail: {
        valid: false,
        validationItemDetails: []
      },
      resolutionConfirmed:
        draftFiling.dissolution?.specialResolution?.resolutionConfirmed ||
        draftFiling.dissolution?.resolution?.resolutionConfirmed || false
    }
    this.setResolution(createResolution)

    // ** do not restore Future Effective data per PO decision
    // ** leave code in case we need it later
    // // Set Future Effective data
    // if (draftFiling.header.isFutureEffective === true) this.setIsFutureEffective(true)
    // if (draftFiling.header.isFutureEffective === false) this.setIsFutureEffective(false)
    // if (draftFiling.header.isFutureEffective && !this.isTypeCoop) {
    //   const effectiveDate = this.apiToDate(draftFiling.header.effectiveDate)
    //   // Check that Effective Date is in the future, to improve UX and
    //   // to work around the default effective date set by the back end.
    //   if (effectiveDate >= this.getCurrentJsDate) this.setEffectiveDate(effectiveDate)
    // }

    // restore Affidavit
    let affidavitDoc: DocIF = null
    if (draftFiling.dissolution?.affidavitFileKey) {
      affidavitDoc = {
        name: draftFiling.dissolution.affidavitFileName,
        lastModified: draftFiling.dissolution.affidavitFileLastModified,
        size: draftFiling.dissolution.affidavitFileSize
      }
    }
    const uploadAffidavit: UploadAffidavitIF = {
      validationDetail: {
        valid: false,
        validationItemDetails: []
      },
      affidavitConfirmed: draftFiling.dissolution?.affidavitConfirmed,
      affidavitDoc: affidavitDoc,
      docKey: draftFiling.dissolution?.affidavitFileKey
    }
    this.setAffidavit(uploadAffidavit)

    // restore Court Order data
    this.setCourtOrderFileNumber(draftFiling.dissolution.courtOrder?.fileNumber)
    this.setHasPlanOfArrangement(draftFiling.dissolution.courtOrder?.hasPlanOfArrangement)

    // restore Certify state
    this.setCertifyState({
      valid: false,
      certifiedBy: draftFiling.header.certifiedBy
    })

    // NB: do not restore/overwrite Folio Number - just use the FN from auth info (see App.vue)

    // NB: Staff role is mutually exclusive with premium account.
    if (this.isRoleStaff) {
      // restore document optional email
      this.setDocumentOptionalEmail(draftFiling.header.documentOptionalEmail)

      // restore Staff Payment data
      this.parseStaffPayment(draftFiling)
    }

    // NB: Premium account is mutually exclusive with staff role.
    if (this.isPremiumAccount) {
      // if Transactional Folio Number exists then restore it
      if (draftFiling.header.isTransactionalFolioNumber && draftFiling.header.folioNumber) {
        this.setTransactionalFolioNumber(draftFiling.header.folioNumber)
      }
    }
  }

  /**
   * Builds dissolution staff payment data from store data.
   * @param filing the filing body to update
   */
  private buildStaffPayment (filing: DissolutionFilingIF): void {
    // Populate Staff Payment according to payment option
    const staffPayment = this.getStaffPaymentStep.staffPayment
    switch (staffPayment.option) {
      case StaffPaymentOptions.FAS:
        filing.header.routingSlipNumber = staffPayment.routingSlipNumber
        filing.header.priority = staffPayment.isPriority
        break

      case StaffPaymentOptions.BCOL:
        filing.header.bcolAccountNumber = staffPayment.bcolAccountNumber
        filing.header.datNumber = staffPayment.datNumber
        // override Folio Number if BCOL FN exists
        if (staffPayment.folioNumber) filing.header.folioNumber = staffPayment.folioNumber
        filing.header.priority = staffPayment.isPriority
        break

      case StaffPaymentOptions.NO_FEE:
        filing.header.waiveFees = true
        filing.header.priority = false
        break

      case StaffPaymentOptions.NONE: // should never happen
        break
    }
  }

  /**
   * Parses dissolution staff payment data into the store.
   * @param filing the filing body to parse
   */
  private parseStaffPayment (filing: DissolutionFilingIF): void {
    // Parse staff payment
    if (filing.header.routingSlipNumber) {
      this.setStaffPayment({
        option: StaffPaymentOptions.FAS,
        routingSlipNumber: filing.header.routingSlipNumber,
        bcolAccountNumber: '',
        datNumber: '',
        folioNumber: '',
        isPriority: filing.header.priority
      })
    } else if (filing.header.bcolAccountNumber) {
      this.setStaffPayment({
        option: StaffPaymentOptions.BCOL,
        routingSlipNumber: '',
        bcolAccountNumber: filing.header.bcolAccountNumber,
        datNumber: filing.header.datNumber,
        folioNumber: filing.header.folioNumber,
        isPriority: filing.header.priority
      })
    } else if (filing.header.waiveFees) {
      this.setStaffPayment({
        option: StaffPaymentOptions.NO_FEE,
        routingSlipNumber: '',
        bcolAccountNumber: '',
        datNumber: '',
        folioNumber: '',
        isPriority: false
      })
    } else {
      this.setStaffPayment({
        option: StaffPaymentOptions.NONE,
        routingSlipNumber: '',
        bcolAccountNumber: '',
        datNumber: '',
        folioNumber: '',
        isPriority: false
      })
    }
  }
}
