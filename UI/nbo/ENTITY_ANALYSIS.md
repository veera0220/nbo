# NBO Backend Entity Analysis

## ✅ Entities Created (Exist in Backend)

### NBO Module Entities:
1. **BusinessUnit** (`nbo_business_unit`) ✅
   - Entity: ✅ Exists
   - Repository: ✅ Exists
   - Controller: ✅ Exists
   - In Pick List API: ✅ Yes

2. **Market** (`nbo_market`) ✅
   - Entity: ✅ Exists
   - Repository: ✅ Exists
   - Controller: ✅ Exists
   - In Pick List API: ✅ Yes
   - ⚠️ ISSUE: NBO entity uses `market` (String) instead of `market_id` (Long)

3. **OrderingType** (`nbo_ordering_type`) ✅
   - Entity: ✅ Exists
   - Repository: ✅ Exists
   - Controller: ✅ Exists
   - In Pick List API: ✅ Yes

4. **Risk** (`nbo_risk`) ✅
   - Entity: ✅ Exists
   - Repository: ✅ Exists
   - Controller: ✅ Exists
   - In Pick List API: ✅ Yes

5. **Type** (`nbo_type`) ✅
   - Entity: ✅ Exists
   - Repository: ✅ Exists
   - Controller: ✅ Exists
   - In Pick List API: ✅ Yes

6. **SalesGroup** (`nbo_sales_group`) ✅
   - Entity: ✅ Exists
   - Repository: ✅ Exists
   - Controller: ✅ Exists
   - In Pick List API: ✅ Yes

7. **Status** (`status` table) ✅
   - Entity: ✅ Exists (but uses table `nbo_status`)
   - Repository: ✅ Exists
   - Controller: ✅ Exists
   - In Pick List API: ✅ Yes
   - ⚠️ ISSUE: Entity table name mismatch - uses `nbo_status` but schema shows `status`

8. **CemOdm** (`nbo_cem_odm`) ✅
   - Entity: ✅ Exists
   - Repository: ❌ Missing
   - Controller: ❌ Missing
   - In Pick List API: ❌ No

9. **SalesRep** (`nbo_sales_rep`) ✅
   - Entity: ✅ Exists
   - Repository: ❌ Missing
   - Controller: ❌ Missing
   - In Pick List API: ❌ No

10. **AppsEng** (`nbo_apps_eng`) ✅
    - Entity: ✅ Exists
    - Repository: ❌ Missing
    - Controller: ❌ Missing
    - In Pick List API: ❌ No

## ❌ Missing Entities (Not Created in Backend)

### From Database Schema:
1. **Application** - Not an entity (just VARCHAR field in NBO table)
   - This is a string field, not a foreign key
   - No entity needed, but could create a master table if needed

2. **Product** - Not an entity (just VARCHAR field in NBO table)
   - `product_text` is VARCHAR(128) in NBO table
   - No foreign key relationship
   - No entity needed unless you want to create a master table

## 🔧 Issues Found

### 1. Market Field Mismatch
- **Database Schema**: `market_id BIGINT` with foreign key to `nbo_market(market_id)`
- **NBO Entity**: `market VARCHAR(128)` (String field)
- **Fix Needed**: Change NBO entity to use `marketId Long` instead of `market String`

### 2. Status Table Name Mismatch
- **Database Schema**: Table name is `status`
- **Status Entity**: Uses `@Table(name = "nbo_status")`
- **Fix Needed**: Either update entity or verify correct table name

### 3. Missing Repositories & APIs
- **SalesRep**: Entity exists but no Repository/Controller/API
- **AppsEng**: Entity exists but no Repository/Controller/API
- **CemOdm**: Entity exists but no Repository/Controller/API

## 📋 Summary

### Entities with Full Implementation (Entity + Repository + Controller + Pick List):
- ✅ BusinessUnit
- ✅ Market
- ✅ OrderingType
- ✅ Risk
- ✅ Type
- ✅ SalesGroup
- ✅ Status

### Entities Missing Repository/Controller/API:
- ❌ SalesRep (Entity exists, needs Repository + Controller + Add to Pick List)
- ❌ AppsEng (Entity exists, needs Repository + Controller + Add to Pick List)
- ❌ CemOdm (Entity exists, needs Repository + Controller + Add to Pick List)

### Fields Not Using Foreign Keys (String instead of ID):
- ⚠️ Market (should be marketId Long, currently market String)
- ⚠️ Application (VARCHAR field - no entity, could create master table)
- ⚠️ Product (VARCHAR field - no entity, could create master table)

