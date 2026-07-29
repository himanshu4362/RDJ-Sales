import { baseApi } from '../../../store/api/baseApi';
import { CACHE_TAGS } from '../../../store/api/tags';
import type { Product } from '../domain/catalog.types';
import type { ProductDTO } from './catalog.dto';
import { mapProductDtoToDomain } from './catalog.mapper';
import type { ProductFormData } from '../validation/catalog.schema';

export interface CatalogQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brandId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number; };
}

// const mockProducts: ProductDTO[] = [
//   { _id: 'prod_1', slug: 'ati-pro-1200w-amplifier', sku: 'ATI-AMP-1200', model_no: 'RX-1200', product_name: 'ATI Pro 1200W Professional Power Amplifier', short_desc: 'Heavy-duty 2-channel amplifier for live sound and DJ setups.', full_desc: '...', category_id: 'cat_amps', brand_id: 'brand_ati', selling_price_paise: 3450000, mrp_paise: 3800000, inventory_count: 4, status_code: 'ACTIVE', images: [], specs: [], warranty_duration: 12, is_featured: true, created_at: new Date(Date.now() - 86400000 * 5).toISOString(), updated_at: new Date().toISOString(), },
//   { _id: 'prod_2', slug: 'ahuja-l15-mb300', sku: 'AHUJA-SPK-300', model_no: 'L15-MB300', product_name: 'Ahuja 15" Mid-Bass PA Speaker', short_desc: 'High-efficiency 300W RMS speaker for custom cabinet builds.', full_desc: '...', category_id: 'cat_speakers', brand_id: 'brand_ahuja', selling_price_paise: 420000, mrp_paise: 450000, inventory_count: 12, status_code: 'ACTIVE', images: [], specs: [], warranty_duration: 12, is_featured: false, created_at: new Date(Date.now() - 86400000 * 10).toISOString(), updated_at: new Date().toISOString(), },
//   { _id: 'prod_3', slug: 'jbl-prx412m', sku: 'JBL-PRX-412', model_no: 'PRX412M', product_name: 'JBL PRX412M 12" Two-Way Stage Monitor', short_desc: 'Premium passive stage monitor for live performances.', full_desc: '...', category_id: 'cat_monitors', brand_id: 'brand_jbl', selling_price_paise: 4250000, mrp_paise: 4800000, inventory_count: 0, status_code: 'OUT_OF_STOCK', images: [], specs: [], warranty_duration: 24, is_featured: true, created_at: new Date(Date.now() - 86400000 * 2).toISOString(), updated_at: new Date().toISOString(), },
//   { _id: 'prod_4', slug: 'yamaha-mg16xu', sku: 'YAM-MIX-16', model_no: 'MG16XU', product_name: 'Yamaha 16-Channel Analog Mixing Console', short_desc: '16-input mixer with built-in SPX digital effects and USB.', full_desc: '...', category_id: 'cat_mixers', brand_id: 'brand_yamaha', selling_price_paise: 3800000, mrp_paise: 4100000, inventory_count: 2, status_code: 'ACTIVE', images: [], specs: [], warranty_duration: 12, is_featured: false, created_at: new Date(Date.now() - 86400000 * 15).toISOString(), updated_at: new Date().toISOString(), },
//   { _id: 'prod_5', slug: 'custom-dual-18-cabinet', sku: 'RDJ-CAB-D18', model_no: 'RDJ-D18-PRO', product_name: 'Custom Dual 18" Subwoofer Empty Cabinet', short_desc: 'Heavy-duty plywood construction, painted finish with internal bracing.', full_desc: '...', category_id: 'cat_cabinets', brand_id: 'brand_custom', selling_price_paise: 1850000, mrp_paise: 2200000, inventory_count: 6, status_code: 'ACTIVE', images: [], specs: [], warranty_duration: 6, is_featured: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
// ];
const mockProducts: ProductDTO[] = [
  {
    _id: 'prod_1',
    slug: 'ati-pro-1200w-amplifier',
    sku: 'ATI-AMP-1200',
    model_no: 'RX-1200',
    product_name: 'ATI Pro 1200W Professional Power Amplifier',
    short_desc: 'Heavy-duty 2-channel amplifier for live sound and DJ setups.',
    full_desc: 'The ATI RX-1200 delivers 600W RMS per channel into 4 ohms, built on a Class-H power supply for consistent headroom under sustained load. Designed for touring and installed sound, it features active crossover switching, clip limiters on every channel, and a fan-cooled aluminum chassis rated for continuous 8-hour operation. Balanced XLR and 1/4" TRS inputs make it equally at home in a rack-mounted PA stack or a mobile DJ rig.',
    category_id: 'cat_amps',
    brand_id: 'brand_ati',
    selling_price_paise: 3450000,
    mrp_paise: 3800000,
    inventory_count: 4,
    status_code: 'ACTIVE',
    images: [
      { id: 'img_1a', s3_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200', is_primary: true, alt_text: 'ATI Pro 1200W amplifier front panel', sort_order: 0 },
      { id: 'img_1b', s3_url: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=1200', is_primary: false, alt_text: 'ATI Pro 1200W amplifier rear connections', sort_order: 1 },
    ],
    specs: [
      { key: 'Power Output (RMS)', val: '600W x 2 @ 4Ω', order: 0 },
      { key: 'Channels', val: '2', order: 1 },
      { key: 'Inputs', val: 'XLR / 1/4" TRS', order: 2 },
      { key: 'Cooling', val: 'Variable-speed fan', order: 3 },
    ],
    warranty_duration: 12,
    is_featured: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    _id: 'prod_2',
    slug: 'ahuja-l15-mb300',
    sku: 'AHUJA-SPK-300',
    model_no: 'L15-MB300',
    product_name: 'Ahuja 15" Mid-Bass PA Speaker',
    short_desc: 'High-efficiency 300W RMS speaker for custom cabinet builds.',
    full_desc: 'A proven mid-bass driver used widely across Indian sound-rental and installation setups. The L15-MB300 uses a treated paper cone with a ribbed edge for tighter low-end control, paired with a heavy ferrite magnet assembly for high sensitivity (98dB) — meaning louder output per watt, which keeps amplifier load and running costs down. Ideal for custom cabinet fabrication, festival stage builds, or replacing a blown driver in an existing enclosure.',
    category_id: 'cat_speakers',
    brand_id: 'brand_ahuja',
    selling_price_paise: 420000,
    mrp_paise: 450000,
    inventory_count: 12,
    status_code: 'ACTIVE',
    images: [
      { id: 'img_2a', s3_url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=1200', is_primary: true, alt_text: 'Ahuja 15 inch mid-bass speaker driver', sort_order: 0 },
    ],
    specs: [
      { key: 'RMS Power', val: '300W', order: 0 },
      { key: 'Impedance', val: '8Ω', order: 1 },
      { key: 'Sensitivity', val: '98dB @ 1W/1m', order: 2 },
      { key: 'Cone Diameter', val: '15 inch', order: 3 },
    ],
    warranty_duration: 12,
    is_featured: false,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    _id: 'prod_3',
    slug: 'jbl-prx412m',
    sku: 'JBL-PRX-412',
    model_no: 'PRX412M',
    product_name: 'JBL PRX412M 12" Two-Way Stage Monitor',
    short_desc: 'Premium passive stage monitor for live performances.',
    full_desc: 'JBL\'s PRX412M pairs a 12" woofer with a 1" compression driver in a wedge-format enclosure, purpose-built for on-stage monitoring where performers need clear, immediate feedback of their own mix. The trapezoidal cabinet doubles as an upright PA top when needed. Rugged carpet covering, steel grille, and recessed handle make it a reliable choice for touring bands and rental houses that need equipment to survive repeated load-in/load-out.',
    category_id: 'cat_monitors',
    brand_id: 'brand_jbl',
    selling_price_paise: 4250000,
    mrp_paise: 4800000,
    inventory_count: 0,
    status_code: 'OUT_OF_STOCK',
    images: [
      { id: 'img_3a', s3_url: 'https://images.unsplash.com/photo-1519508234439-4f23643125c1?w=1200', is_primary: true, alt_text: 'JBL PRX412M stage monitor wedge', sort_order: 0 },
      { id: 'img_3b', s3_url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=1200', is_primary: false, alt_text: 'JBL PRX412M grille close-up', sort_order: 1 },
    ],
    specs: [
      { key: 'Configuration', val: '2-Way Passive', order: 0 },
      { key: 'Woofer', val: '12 inch', order: 1 },
      { key: 'Power Handling', val: '350W Continuous', order: 2 },
      { key: 'Use Case', val: 'Stage Monitor / Upright PA', order: 3 },
    ],
    warranty_duration: 24,
    is_featured: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    _id: 'prod_4',
    slug: 'yamaha-mg16xu',
    sku: 'YAM-MIX-16',
    model_no: 'MG16XU',
    product_name: 'Yamaha 16-Channel Analog Mixing Console',
    short_desc: '16-input mixer with built-in SPX digital effects and USB.',
    full_desc: 'The MG16XU brings Yamaha\'s well-regarded D-PRE mic preamps to a compact analog frame, giving vocals and instruments a clean, low-noise signal path before any processing. Onboard SPX digital effects (reverb, delay, chorus) mean smaller acts can run a full show without an outboard rack. A built-in USB audio interface also lets the same console double as a 2-track recording input for live albums or soundchecks, without extra hardware.',
    category_id: 'cat_mixers',
    brand_id: 'brand_yamaha',
    selling_price_paise: 3800000,
    mrp_paise: 4100000,
    inventory_count: 2,
    status_code: 'ACTIVE',
    images: [
      { id: 'img_4a', s3_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200', is_primary: true, alt_text: 'Yamaha MG16XU mixing console top view', sort_order: 0 },
    ],
    specs: [
      { key: 'Channels', val: '16 (10 Mic/Line)', order: 0 },
      { key: 'Preamps', val: 'Yamaha D-PRE', order: 1 },
      { key: 'Effects', val: 'Onboard SPX Digital FX', order: 2 },
      { key: 'Connectivity', val: 'USB 2.0 Audio I/O', order: 3 },
    ],
    warranty_duration: 12,
    is_featured: false,
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    _id: 'prod_5',
    slug: 'custom-dual-18-cabinet',
    sku: 'RDJ-CAB-D18',
    model_no: 'RDJ-D18-PRO',
    product_name: 'Custom Dual 18" Subwoofer Empty Cabinet',
    short_desc: 'Heavy-duty plywood construction, painted finish with internal bracing.',
    full_desc: 'Built in-house using 18mm Baltic birch plywood with internal cross-bracing to control panel resonance at high SPL. Designed as a ported dual-18" enclosure, tuned for tight, punchy low-end suited to Indian wedding and DJ setups where sub output needs to cut through a crowd without turning boomy. Comes unloaded (no drivers) so customers can spec their own woofers, or we can wire and load it to order — ask us about driver pairing during checkout.',
    category_id: 'cat_cabinets',
    brand_id: 'brand_custom',
    selling_price_paise: 1850000,
    mrp_paise: 2200000,
    inventory_count: 6,
    status_code: 'ACTIVE',
    images: [
      { id: 'img_5a', s3_url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=1200', is_primary: true, alt_text: 'Custom dual 18 inch subwoofer cabinet', sort_order: 0 },
      { id: 'img_5b', s3_url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=1200', is_primary: false, alt_text: 'Subwoofer cabinet internal bracing', sort_order: 1 },
    ],
    specs: [
      { key: 'Configuration', val: 'Dual 18" Ported', order: 0 },
      { key: 'Material', val: '18mm Baltic Birch Plywood', order: 1 },
      { key: 'Finish', val: 'Textured Black Paint', order: 2 },
      { key: 'Drivers Included', val: 'No — Empty Cabinet', order: 3 },
    ],
    warranty_duration: 6,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    _id: 'prod_6',
    slug: 'shure-sm58-vocal-mic',
    sku: 'SHURE-MIC-58',
    model_no: 'SM58-LC',
    product_name: 'Shure SM58 Dynamic Vocal Microphone',
    short_desc: 'Industry-standard dynamic mic built for live vocals.',
    full_desc: 'The SM58 needs no introduction — it\'s the microphone most working vocalists have used at least once. A cardioid pickup pattern rejects off-axis stage noise and bleed from monitors, while the built-in spherical filter cuts breath pops and handling noise without needing an external windscreen. The all-metal construction and pneumatic shock-mount capsule are why this exact model has survived being dropped, rained on, and thrown into gig bags for decades without failing.',
    category_id: 'cat_microphones',
    brand_id: 'brand_shure',
    selling_price_paise: 980000,
    mrp_paise: 1100000,
    inventory_count: 18,
    status_code: 'ACTIVE',
    images: [
      { id: 'img_6a', s3_url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1200', is_primary: true, alt_text: 'Shure SM58 dynamic microphone', sort_order: 0 },
    ],
    specs: [
      { key: 'Type', val: 'Dynamic', order: 0 },
      { key: 'Polar Pattern', val: 'Cardioid', order: 1 },
      { key: 'Frequency Response', val: '50Hz – 15kHz', order: 2 },
      { key: 'Connector', val: 'XLR (3-pin)', order: 3 },
    ],
    warranty_duration: 24,
    is_featured: true,
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    _id: 'prod_7',
    slug: 'crown-xls2502-amplifier',
    sku: 'CROWN-AMP-2502',
    model_no: 'XLS2502',
    product_name: 'Crown XLS2502 DriveCore 2-Channel Amplifier',
    short_desc: 'Lightweight, high-output amp with onboard DSP presets.',
    full_desc: 'Crown\'s DriveCore architecture packs the analog input stage, DSP, and output devices onto a single chip, cutting weight and heat without cutting output — this amp delivers 775W per channel at 4 ohms from a 2U chassis you can lift with one hand. Includes selectable onboard presets tuned for popular passive speaker models, so system setup for a rental gig takes minutes instead of a laptop and a tuning session.',
    category_id: 'cat_amps',
    brand_id: 'brand_crown',
    selling_price_paise: 2950000,
    mrp_paise: 3300000,
    inventory_count: 5,
    status_code: 'ACTIVE',
    images: [
      { id: 'img_7a', s3_url: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=1200', is_primary: true, alt_text: 'Crown XLS2502 amplifier front panel', sort_order: 0 },
      { id: 'img_7b', s3_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200', is_primary: false, alt_text: 'Crown XLS2502 rack mounted', sort_order: 1 },
    ],
    specs: [
      { key: 'Power Output (RMS)', val: '775W x 2 @ 4Ω', order: 0 },
      { key: 'Technology', val: 'DriveCore', order: 1 },
      { key: 'DSP', val: 'Onboard Speaker Presets', order: 2 },
      { key: 'Chassis', val: '2U Rack, Lightweight', order: 3 },
    ],
    warranty_duration: 24,
    is_featured: false,
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    _id: 'prod_8',
    slug: 'behringer-x32-compact',
    sku: 'BEHR-DIG-X32C',
    model_no: 'X32 COMPACT',
    product_name: 'Behringer X32 Compact Digital Mixing Console',
    short_desc: '40-input digital mixer with total recall and remote control.',
    full_desc: 'A full-featured digital console shrunk into a 25-input physical frame, with 40 mixing channels available via the onboard scene system. Every setting — gain, EQ, dynamics, routing — saves and recalls instantly per show, eliminating the guesswork of resetting a mixer between different events. The X32-Edit app lets an engineer mix from the audience or backstage over WiFi, useful for houses of worship, corporate AV, and touring FOH engineers who want to hear the room, not just the stage.',
    category_id: 'cat_mixers',
    brand_id: 'brand_behringer',
    selling_price_paise: 7200000,
    mrp_paise: 7900000,
    inventory_count: 1,
    status_code: 'ACTIVE',
    images: [
      { id: 'img_8a', s3_url: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=1200', is_primary: true, alt_text: 'Behringer X32 Compact digital mixer', sort_order: 0 },
    ],
    specs: [
      { key: 'Channels', val: '40 (25 Physical Inputs)', order: 0 },
      { key: 'Control', val: 'Total Recall / Scene Storage', order: 1 },
      { key: 'Remote', val: 'WiFi via X32-Edit App', order: 2 },
      { key: 'Onboard FX', val: '8 Stereo FX Engines', order: 3 },
    ],
    warranty_duration: 12,
    is_featured: true,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date().toISOString(),
  },
];


// Helper to isolate mapper responsibility
const mapSpecificationsToDto = (specs: ProductFormData['specifications']) => {
  return specs.map((spec, index) => ({
    key: spec.name,
    val: spec.value,
    order: index
  }));
};

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedResponse<Product>, CatalogQuery>({
      queryFn: (params) => {
        let filteredData = [...mockProducts];
        if (params?.search) {
          const searchLower = params.search.toLowerCase();
          filteredData = filteredData.filter(
            (prod) => prod.product_name.toLowerCase().includes(searchLower) || prod.model_no.toLowerCase().includes(searchLower) || prod.sku.toLowerCase().includes(searchLower)
          );
        }
        if (params?.categoryId) filteredData = filteredData.filter((prod) => prod.category_id === params.categoryId);
        if (params?.brandId) filteredData = filteredData.filter((prod) => prod.brand_id === params.brandId);
        if (params?.status) filteredData = filteredData.filter((prod) => prod.status_code === params.status);
        if (params?.sortBy) {
          const fieldMap: Record<string, keyof ProductDTO> = { sellingPrice: 'selling_price_paise', createdAt: 'created_at', name: 'product_name', modelNumber: 'model_no' };
          const field = fieldMap[params.sortBy] || 'created_at';
          const order = params?.sortOrder || 'desc';
          filteredData.sort((a, b) => {
            if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
            return 0;
          });
        } else {
          filteredData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 20;
        const total = filteredData.length;
        const totalPages = Math.ceil(total / limit) || 1;
        const startIndex = (page - 1) * limit;
        const paginatedSlice = filteredData.slice(startIndex, startIndex + limit);
        const domainData = paginatedSlice.map(mapProductDtoToDomain);
        return { data: { data: domainData, meta: { total, page, limit, totalPages } } };
      },
      providesTags: (result) => result ? [ ...result.data.map(({ id }) => ({ type: CACHE_TAGS.Product, id })), { type: CACHE_TAGS.Product, id: 'LIST' } ] : [{ type: CACHE_TAGS.Product, id: 'LIST' }],
    }),
    
    getProductBySlug: builder.query<Product, string>({
      queryFn: (slug) => {
        const matchingDto = mockProducts.find((prod) => prod.slug === slug);
        if (!matchingDto) {
          return { error: { status: 404, statusText: 'Not Found', data: { message: `Product not found.` } } };
        }
        return { data: mapProductDtoToDomain(matchingDto) };
      },
      providesTags: (_result, _error, slug) => [{ type: CACHE_TAGS.Product, id: slug }],
    }),

    createProduct: builder.mutation<Product, ProductFormData>({
      queryFn: (formData) => {
        const newSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 100);
        const newId = `prod_${Math.random().toString(36).slice(2, 11)}`;
        const newDto: ProductDTO = {
          _id: newId, sku: formData.sku, slug: newSlug, model_no: formData.modelNumber, product_name: formData.name, short_desc: formData.shortDescription, full_desc: formData.description, category_id: formData.categoryId, brand_id: formData.brandId, selling_price_paise: formData.sellingPrice * 100, mrp_paise: formData.mrp * 100, inventory_count: formData.stock.quantity, status_code: formData.status,
          images: formData.images.map((img, idx) => ({ id: img.id || `img_${Math.random().toString(36).slice(2, 11)}`, s3_url: img.url, is_primary: img.isPrimary, alt_text: img.alt || null, sort_order: img.displayOrder ?? idx })),
          specs: mapSpecificationsToDto(formData.specifications),
          warranty_duration: formData.warrantyMonths, is_featured: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        }; 
        mockProducts.unshift(newDto);
        return { data: mapProductDtoToDomain(newDto) };
      },
      invalidatesTags: [{ type: CACHE_TAGS.Product, id: 'LIST' }],
    }),

    getPublicProducts: builder.query<PaginatedResponse<Product>, Omit<CatalogQuery, 'status'>>({
      queryFn: (params) => {
        let filteredData = mockProducts.filter(prod => prod.status_code === 'ACTIVE');
        if (params?.search) {
          const searchLower = params.search.toLowerCase();
          filteredData = filteredData.filter(
            (prod) => prod.product_name.toLowerCase().includes(searchLower) || prod.model_no.toLowerCase().includes(searchLower) || prod.sku.toLowerCase().includes(searchLower)
          );
        }
        if (params?.categoryId) filteredData = filteredData.filter((prod) => prod.category_id === params.categoryId);
        if (params?.brandId) filteredData = filteredData.filter((prod) => prod.brand_id === params.brandId);
        
        filteredData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 20;
        const total = filteredData.length;
        const startIndex = (page - 1) * limit;
        
        return { 
          data: { 
            data: filteredData.slice(startIndex, startIndex + limit).map(mapProductDtoToDomain), 
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 } 
          } 
        };
      },
      providesTags: ['Product'], 
    }),

    updateProduct: builder.mutation<Product, { slug: string; data: ProductFormData }>({
      queryFn: ({ slug, data }) => {
        const index = mockProducts.findIndex(p => p.slug === slug);
        if (index === -1) return { error: { status: 404, statusText: 'Not Found', data: 'Product not found' } };
        const existingDto = mockProducts[index];
        const updatedDto: ProductDTO = {
          ...existingDto, sku: data.sku, model_no: data.modelNumber, product_name: data.name, short_desc: data.shortDescription, full_desc: data.description, category_id: data.categoryId, brand_id: data.brandId, selling_price_paise: data.sellingPrice * 100, mrp_paise: data.mrp * 100, inventory_count: data.stock.quantity, status_code: data.status, warranty_duration: data.warrantyMonths,
          images: data.images.map((img, idx) => ({ id: img.id || `img_${Math.random().toString(36).slice(2, 11)}`, s3_url: img.url, is_primary: img.isPrimary, alt_text: img.alt || null, sort_order: img.displayOrder ?? idx })),
          specs: mapSpecificationsToDto(data.specifications),
          updated_at: new Date().toISOString(),
        }; 
        mockProducts[index] = updatedDto;
        return { data: mapProductDtoToDomain(updatedDto) };
      },
      invalidatesTags: (result, error, arg) => [{ type: CACHE_TAGS.Product, id: arg.slug }, { type: CACHE_TAGS.Product, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetPublicProductsQuery, useGetProductsQuery, useGetProductBySlugQuery, useCreateProductMutation, useUpdateProductMutation } = catalogApi;