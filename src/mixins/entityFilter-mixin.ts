import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { CorpTypeCd } from '@/enums'

/**
 * Mixin that provides an entity filter utility.
 */
@Component({})
export default class EntityFilterMixin extends Vue {
  @Getter getEntityType!: CorpTypeCd

  /**
   * Method to compare the conditional entity to the entityType defined from the Store.
   *
   * @param entity The entity type of the component.
   * @return boolean A boolean indicating if the entityType given matches the entityType assigned to the component.
   */
  entityFilter (entityType: CorpTypeCd): boolean {
    return (this.getEntityType === entityType)
  }
}
