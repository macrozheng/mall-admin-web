<!-- FilterBar.vue -->
<template>
  <div class="filter-bar">
    <div class="filter-container">
      <!-- Text Input Filter -->
      <div 
        v-for="filter in textFilters" 
        :key="`text-${filter.key}`"
        class="filter-item"
      >
        <label :for="filter.key">{{ filter.label }}</label>
        <input
          :id="filter.key"
          v-model="localFilters[filter.key]"
          type="text"
          :placeholder="filter.placeholder"
          @input="debounceEmit"
        />
      </div>

      <!-- Select Filter -->
      <div 
        v-for="filter in selectFilters" 
        :key="`select-${filter.key}`"
        class="filter-item"
      >
        <label :for="filter.key">{{ filter.label }}</label>
        <select
          :id="filter.key"
          v-model="localFilters[filter.key]"
          @change="handleFilterChange"
        >
          <option value="">{{ filter.placeholder }}</option>
          <option 
            v-for="option in filter.options" 
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Date Range Filter -->
      <div 
        v-for="filter in dateRangeFilters" 
        :key="`date-${filter.key}`"
        class="filter-item date-range"
      >
        <label>{{ filter.label }}</label>
        <div class="date-inputs">
          <input
            v-model="localFilters[`${filter.key}Start`]"
            type="date"
            @change="handleFilterChange"
          />
          <span class="separator">to</span>
          <input
            v-model="localFilters[`${filter.key}End`]"
            type="date"
            @change="handleFilterChange"
          />
        </div>
      </div>
    </div>

    <div class="filter-actions">
      <button 
        type="button" 
        class="btn-reset"
        @click="resetFilters"
      >
        Reset
      </button>
      <button 
        type="button" 
        class="btn-apply"
        @click="applyFilters"
      >
        Apply Filters
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterBar',
  props: {
    // Configuration for text filters
    textFilters: {
      type: Array,
      default: () => [],
      validator: (filters) => filters.every(f => f.key && f.label)
    },
    // Configuration for select filters
    selectFilters: {
      type: Array,
      default: () => [],
      validator: (filters) => filters.every(f => 
        f.key && f.label && Array.isArray(f.options)
      )
    },
    // Configuration for date range filters
    dateRangeFilters: {
      type: Array,
      default: () => [],
      validator: (filters) => filters.every(f => f.key && f.label)
    },
    // Initial filter values
    modelValue: {
      type: Object,
      default: () => ({})
    },
    // Debounce delay for text inputs (ms)
    debounceDelay: {
      type: Number,
      default: 300
    }
  },
  emits: ['update:modelValue', 'apply'],
  data() {
    return {
      localFilters: { ...this.modelValue },
      debounceTimer: null
    }
  },
  watch: {
    modelValue: {
      handler(newVal) {
        this.localFilters = { ...newVal }
      },
      deep: true
    }
  },
  methods: {
    handleFilterChange() {
      this.$emit('update:modelValue', { ...this.localFilters })
    },
    
    debounceEmit() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.handleFilterChange()
      }, this.debounceDelay)
    },
    
    applyFilters() {
      this.$emit('apply', { ...this.localFilters })
    },
    
    resetFilters() {
      const resetValues = {}
      
      // Reset text filters
      this.textFilters.forEach(filter => {
        resetValues[filter.key] = ''
      })
      
      // Reset select filters
      this.selectFilters.forEach(filter => {
        resetValues[filter.key] = ''
      })
      
      // Reset date range filters
      this.dateRangeFilters.forEach(filter => {
        resetValues[`${filter.key}Start`] = ''
        resetValues[`${filter.key}End`] = ''
      })
      
      this.localFilters = resetValues
      this.$emit('update:modelValue', resetValues)
      this.$emit('apply', resetValues)
    }
  }
}
</script>

<style scoped>
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  flex: 1;
}

.filter-item {
  display: flex;
  flex-direction: column;
  min-width: 200px;
}

.filter-item label {
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 14px;
  color: #495057;
}

.filter-item input,
.filter-item select {
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
}

.filter-item input:focus,
.filter-item select:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.date-range .date-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-range .separator {
  white-space: nowrap;
  color: #6c757d;
}

.filter-actions {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.btn-reset,
.btn-apply {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset {
  background: #e9ecef;
  color: #495057;
}

.btn-reset:hover {
  background: #dee2e6;
}

.btn-apply {
  background: #0d6efd;
  color: white;
}

.btn-apply:hover {
  background: #0b5ed7;
}
</style>