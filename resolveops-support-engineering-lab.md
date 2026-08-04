# ResolveOps — Frontend-Only Uygulama Şartnamesi

> Bu dosya Antigravity'ye verilecek uygulama talimatıdır. Önce tamamını oku, ardından yalnızca burada tanımlanan frontend kapsamını uygula. Backend, veritabanı veya gerçek dış servis geliştirmesine başlama.

## 1. Projenin amacı

**Proje adı:** ResolveOps  
**Repository adı:** `resolveops-support-engineering-lab`  
**Kısa tanım:** A production-like SaaS application support lab for investigating API, authentication, database, webhook and background-job incidents.

ResolveOps, iki yüzü olan örnek bir B2B SaaS ürünüdür:

1. **Customer Portal:** Müşteri şirketlerinin ekip, abonelik, API anahtarı, entegrasyon, webhook ve destek taleplerini yönettiği alan.
2. **Support Console:** Destek ekibinin ticket, müşteri hesabı, request trace, log, webhook delivery, background job ve incident kayıtlarını araştırdığı alan.

Bu portföy projesinin ana hikâyesi şudur:

1. Müşteri üründe bir sorun yaşar.
2. Uygulama müşteriye bir `requestId` gösterir.
3. Müşteri bu bilgiyle destek talebi açar.
4. Support Agent ticket'ı inceler.
5. Agent aynı `requestId` üzerinden trace, log, webhook ve job kayıtlarını ilişkilendirir.
6. Root cause belirler, iç not ekler, çözümü belgeler ve müşteriye cevap verir.

Frontend yalnızca güzel ekranlar göstermemeli; bu araştırma akışını mock verilerle gerçekten kullanılabilir hâle getirmelidir.

## 2. Bu aşamanın kesin kapsamı

Bu aşamada **yalnızca frontend** geliştirilecek.

- Tüm veriler yerel mock fixture'lardan gelecek.
- Veri okuma ve yazma işlemleri asenkron servis çağrısı gibi davranacak.
- Gerçek HTTP isteği yapılmayacak.
- Kullanıcı aksiyonları mock state'i güncelleyecek.
- Değişiklikler sayfa yenilendiğinde kaybolmasın diye mock state `localStorage` içinde saklanabilir.
- Uygulamada **Reset demo data** aksiyonu bulunacak ve seed verilerini geri yükleyecek.
- Gelecekte backend bağlanabilmesi için sayfalar fixture dosyalarını doğrudan import etmeyecek.
- Tasarımın renk, tipografi, boşluk, gölge, ikon seti ve görsel kimlik kararlarını kullanıcı daha sonra kendisi verecek.
- UI metinleri ve örnek içerikler **İngilizce** olacak. Kod, değişken ve dosya isimleri de İngilizce olacak.

## 3. Başarı ölçütü

İlk frontend sürümü tamamlandığında bir işe alım yöneticisi, backend olmadan şu demo akışını gerçekleştirebilmelidir:

1. Demo Customer Owner hesabıyla giriş yapmak.
2. Dashboard ve organizasyon bağlamını görmek.
3. Başarısız bir webhook'u incelemek.
4. İlgili `requestId` ile yeni ticket açmak.
5. Çıkış yapıp Demo Support Agent hesabıyla giriş yapmak.
6. Yeni ticket'ı queue içinde bulmak.
7. Ticket'ı kendine atamak, öncelik ve durumu değiştirmek.
8. İlgili trace, log, webhook delivery ve job kayıtlarına gitmek.
9. Internal note ve public reply eklemek.
10. Root cause ve resolution alanlarını doldurup ticket'ı çözmek.
11. Ticket timeline'ında bütün işlemleri görmek.

## 4. Teknik temel

### 4.1 Zorunlu teknoloji seçimi

- React
- TypeScript — `strict` mod
- Vite
- React Router
- Form yönetimi için React Hook Form
- Form doğrulama için Zod
- Tarih işlemleri için küçük bir yardımcı kütüphane kullanılabilir
- Testler için Vitest + React Testing Library
- E2E smoke testleri için Playwright tercih edilir

Paket yöneticisi olarak mevcut repository'nin tercihini kullan. Yeni repository ise `npm` yeterlidir.

### 4.2 State yaklaşımı

State'i üç kategoriye ayır:

1. **Auth/session state:** Giriş yapan demo kullanıcı, rol ve aktif organizasyon.
2. **Server-like mock state:** Ticket'lar, mesajlar, üyeler, webhook kayıtları vb. Tüm erişim typed service katmanından yapılmalı.
3. **UI state:** Açık modal, seçili tab, toast gibi geçici durumlar. Filtre, arama, sıralama, sayfa ve tab mümkün olduğunda URL search parametrelerinde tutulmalı.

Global state kütüphanesi zorunlu değildir. React Context veya küçük bir store kullanılabilir. Gereksiz global state oluşturma.

### 4.3 Veri erişim sınırı

Page component'leri `src/mocks/fixtures` içinden veri import etmemeli. Şu akış korunmalı:

```text
Page / Feature Component
        ↓
Typed service interface
        ↓
Mock service implementation
        ↓
Fixtures + localStorage
```

Servisler Promise döndürmeli ve yapılandırılabilir kısa gecikme simüle etmelidir. Böylece loading state'leri gerçekten görülebilir.

Önerilen sonuç tipi:

```ts
type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: AppError };

interface AppError {
  code: string;
  message: string;
  requestId?: string;
  fieldErrors?: Record<string, string>;
}
```

Gelecekte gerçek backend geldiğinde mock servislerin içi veya adapter seçimi değişebilmeli; page component'leri yeniden yazılmamalı.

### 4.4 Önerilen klasör yapısı

```text
src/
  app/
    App.tsx
    router.tsx
    providers.tsx
    routeGuards.tsx
  layouts/
    AuthLayout.tsx
    CustomerLayout.tsx
    SupportLayout.tsx
  pages/
    auth/
    customer/
    support/
    system/
  features/
    auth/
    team/
    apiKeys/
    integrations/
    webhooks/
    tickets/
    traces/
    logs/
    jobs/
    incidents/
    runbooks/
  components/
    navigation/
    data-display/
    feedback/
    forms/
    overlays/
  domain/
    models.ts
    enums.ts
    permissions.ts
  services/
    contracts/
    mock/
    serviceRegistry.ts
  mocks/
    fixtures/
    scenarios/
    seed.ts
  store/
    authStore.ts
    demoDataStore.ts
  lib/
    dates.ts
    ids.ts
    masking.ts
    queryParams.ts
  styles/
  tests/
```

Bu yapı birebir zorunlu değildir; ancak domain, servis, mock veri ve UI sorumlulukları birbirinden ayrılmalıdır.

## 5. Roller, izinler ve demo hesapları

### 5.1 Uygulama rolleri

- `customer_owner`
- `customer_member`
- `support_agent`
- `support_lead`

Route ve aksiyon yetkileri tek bir permission map üzerinden hesaplanmalı. Component içinde dağınık e-posta veya rol kontrolleri yazma.

### 5.2 Demo hesapları

Login ekranında aşağıdaki hesaplar görünür şekilde sunulmalı:

| Hesap | E-posta | Şifre | Rol |
|---|---|---|---|
| Customer Owner | `owner@northstar.demo` | `Demo123!` | `customer_owner` |
| Customer Member | `member@northstar.demo` | `Demo123!` | `customer_member` |
| Support Agent | `maya@resolveops.demo` | `Demo123!` | `support_agent` |
| Support Lead | `lead@resolveops.demo` | `Demo123!` | `support_lead` |

Hızlı demo için her hesabın yanında **Use demo account** aksiyonu olabilir. Bu gerçek kimlik doğrulama değildir.

### 5.3 Yetki özeti

- Customer kullanıcıları yalnızca kendi organizasyon verilerini görür.
- Customer Member, ekip rolü değiştiremez ve API key iptal edemez.
- Customer kullanıcıları internal note, stack trace ve diğer müşterilerin kayıtlarını göremez.
- Support Agent, bütün demo organizasyonlarının support bağlamını görebilir.
- Support Lead, Agent yetkilerine ek olarak incident durumu ve ticket ataması yönetebilir.
- Yetkisiz route erişimi `/403` sayfasına gitmeli.
- Oturum yoksa protected route `/login` sayfasına yönlenmeli ve hedef URL korunmalı.

## 6. Route haritası

### 6.1 Genel route'lar

| Route | Sayfa | Erişim |
|---|---|---|
| `/` | Role göre dashboard'a redirect | Herkes |
| `/login` | Demo login | Public |
| `/403` | Forbidden | Herkes |
| `*` | Not Found | Herkes |

### 6.2 Customer Portal route'ları

| Route | Sayfa |
|---|---|
| `/app/dashboard` | Customer Dashboard |
| `/app/team` | Team Members |
| `/app/team/:memberId` | Team Member Detail |
| `/app/subscription` | Subscription & Billing |
| `/app/api-keys` | API Keys |
| `/app/integrations` | Integrations |
| `/app/integrations/:integrationId` | Integration Detail |
| `/app/webhooks` | Webhook Endpoints & Deliveries |
| `/app/webhooks/:deliveryId` | Customer Webhook Delivery Detail |
| `/app/activity` | Activity Log |
| `/app/support` | Support Requests |
| `/app/support/new` | New Support Request |
| `/app/support/:ticketId` | Customer Ticket Detail |

### 6.3 Support Console route'ları

| Route | Sayfa |
|---|---|
| `/support/dashboard` | Support Dashboard |
| `/support/tickets` | Ticket Queue |
| `/support/tickets/:ticketId` | Support Ticket Detail |
| `/support/customers/:organizationId` | Customer 360 |
| `/support/traces` | Request Trace Explorer |
| `/support/traces/:requestId` | Request Trace Detail |
| `/support/logs` | Log Explorer |
| `/support/webhooks` | Webhook Delivery Inspector |
| `/support/webhooks/:deliveryId` | Support Webhook Delivery Detail |
| `/support/jobs` | Background Job Monitor |
| `/support/jobs/:jobId` | Background Job Detail |
| `/support/incidents` | Incident Center |
| `/support/incidents/:incidentId` | Incident Detail |
| `/support/runbooks` | Knowledge Base / Runbooks |
| `/support/runbooks/:slug` | Runbook Detail |

## 7. Layout ve navigasyon iskeleti

Görsel tasarım yapma; fakat kullanılabilir semantik iskeleti kur.

### 7.1 Auth Layout

- Uygulama adı ve kısa açıklama
- Login formu
- Demo hesap seçimi
- Bu ortamın mock frontend demosu olduğunu belirten bilgi

### 7.2 Customer Layout

- Customer Portal etiketi
- Aktif organizasyon adı
- Ana navigasyon
- Giriş yapan kullanıcı ve rolü
- Support Console'a geçiş yalnızca support rolleri için görünür
- Reset demo data ve Sign out aksiyonları
- İçerik için breadcrumb ve page title alanı

### 7.3 Support Layout

- Support Console etiketi
- Ticket, diagnostics, incidents ve runbooks grupları
- Global arama giriş alanı; bu sürümde ticket ID, request ID ve organization adına göre mock sonuç döndürebilir
- Giriş yapan agent bilgisi
- Customer Portal'a geçiş
- Reset demo data ve Sign out aksiyonları

## 8. Customer Portal sayfa şartları

Her sayfada loading, empty, error ve success durumlarını ele al. Liste sayfalarında filtre sonucu bulunmadığında ayrı empty state göster.

### 8.1 Login — `/login`

Alanlar:

- Email
- Password
- Remember me
- Sign in
- Demo account shortcuts

Davranışlar:

- Zod ile alan doğrulaması yap.
- Hatalı credentials için form-level hata göster.
- Submit sırasında loading durumu göster.
- Role göre doğru dashboard'a yönlendir.
- Query parametresindeki güvenli `returnTo` değerini destekle.
- `Forgot password` yalnızca disabled veya açıklamalı placeholder olabilir.

### 8.2 Customer Dashboard — `/app/dashboard`

Göster:

- Organization name
- Active users
- Current plan
- API requests today
- Failed webhooks
- Open support tickets
- System status
- Recent activity
- Son başarısız webhook ve açık ticket'lara hızlı bağlantılar

Grafik zorunlu değildir. Veriyi anlaşılır başlık ve değerlerle göster.

### 8.3 Team Members — `/app/team`

Liste alanları:

- Name
- Email
- Role
- Status
- Last active
- Joined at

Filtreler: role, status, search.  
Aksiyonlar: invite member, view detail, change role, deactivate/reactivate.  
Customer Member için yönetim aksiyonları disabled veya gizli olmalı; erişilebilir açıklama sağla.

Invite formu:

- Full name
- Email
- Role

Form gönderildiğinde yeni mock üye ekle, toast göster ve activity kaydı oluştur.

### 8.4 Team Member Detail — `/app/team/:memberId`

- Profil bilgileri
- Organization role
- Account status
- Last activity
- Recent actions
- Owner için role ve status yönetimi
- Kayıt bulunmazsa anlaşılır not-found state

### 8.5 Subscription & Billing — `/app/subscription`

Göster:

- Plan name
- Status: `trialing`, `active`, `past_due`, `cancelled`, `suspended`
- Start date
- Renewal date
- Seat/API/storage limitleri ve kullanımı
- Last payment status
- Plan history

Gerçek ödeme formu veya plan değiştirme akışı oluşturma. `Manage billing` aksiyonu disabled placeholder ve açıklama olabilir.

### 8.6 API Keys — `/app/api-keys`

Liste alanları:

- Name
- Prefix
- Created at
- Last used at
- Created by
- Status

Aksiyonlar:

- Create API key
- Revoke API key
- Copy prefix

Yeni key oluşturulunca tam değer yalnızca bir kez modal içinde gösterilmeli. Sonradan yalnızca maskeli prefix görünmeli. Üretilen değer demo değeridir. Revoke aksiyonu confirmation gerektirmeli ve activity kaydı oluşturmalıdır.

### 8.7 Integrations — `/app/integrations`

Liste alanları:

- Name
- Type: `CRM`, `Accounting`, `Webhook`, `Custom API`
- Endpoint host
- Authentication type
- Status
- Last sync
- Last error

Filtreler: type, status, search.  
Aksiyonlar: add mock integration, view, enable/disable, test connection.  
Test connection gerçek ağ isteği yapmamalı; fixture'daki scenario sonucunu gecikmeyle döndürmeli.

### 8.8 Integration Detail — `/app/integrations/:integrationId`

- Integration summary
- Masked configuration values
- Connection status
- Last synchronization
- Last error
- Recent sync history
- Related webhook deliveries
- Related support tickets
- Test connection ve enable/disable aksiyonları

Secret/token açık metin gösterme.

### 8.9 Webhooks — `/app/webhooks`

İki bölüm veya tab:

1. **Endpoints:** name, URL, subscribed events, status, created at.
2. **Recent deliveries:** event, endpoint, status code, result, attempt, created at, duration, request ID.

Filtreler: endpoint, event, success/failed, date.  
Aksiyonlar: add endpoint, enable/disable, open delivery, retry failed delivery.  
Retry gerçek istek yapmamalı; mock delivery history'ye yeni attempt eklemelidir.

### 8.10 Customer Webhook Delivery Detail — `/app/webhooks/:deliveryId`

- Event
- Endpoint
- Result and HTTP status
- Attempt history
- Created at and duration
- Request headers — sensitive values maskeli
- Request payload
- Response body
- Error message
- Next retry
- Request ID kopyalama
- Create support request aksiyonu; ticket formuna request ID ve kategori taşımalı

Customer kullanıcısına internal stack trace gösterme.

### 8.11 Activity Log — `/app/activity`

Alanlar:

- Timestamp
- Actor
- Action
- Resource
- Result
- Short description

Filtreler: actor, action, result, date range.  
Liste yalnızca aktif organizasyon verisini göstermeli.

### 8.12 Support Requests — `/app/support`

Alanlar:

- Ticket ID
- Subject
- Category
- Priority
- Status
- Created at
- Last updated

Filtreler: status, category, search.  
Aksiyonlar: open ticket, create support request.

### 8.13 New Support Request — `/app/support/new`

Form alanları:

- Subject
- Category
- Description
- Impact
- Affected user
- Request ID
- Occurrence time
- Environment
- Reproduction steps
- Attachment metadata

Category seçenekleri:

- Login and authentication
- Access and permissions
- API problem
- Webhook problem
- Subscription problem
- Data inconsistency
- Performance problem
- Other

Impact seçenekleri:

- One user affected
- Multiple users affected
- Entire organization affected
- Business-critical operation blocked

Dosya gerçekten upload edilmemeli. Sadece ad, boyut ve tür metadata'sı local mock state'e kaydedilebilir. Submit sonrası ticket oluşmalı, ticket ID üretilmeli, activity ve timeline kayıtları eklenmeli ve detail sayfasına yönlendirilmelidir.

### 8.14 Customer Ticket Detail — `/app/support/:ticketId`

Göster:

- Ticket ID, subject, category, priority, status
- Created/updated timestamps
- Customer-visible conversation
- Attachment metadata
- Customer-facing resolution
- Public reply formu

Gösterme:

- Internal notes
- Stack trace
- Internal investigation records
- Diğer organizasyon bilgileri

Customer reply eklendiğinde ticket durumu gerekiyorsa `waiting_for_support` olmalı ve timeline güncellenmelidir.

## 9. Support Console sayfa şartları

### 9.1 Support Dashboard — `/support/dashboard`

Özetler:

- Unassigned tickets
- High-priority tickets
- Waiting for customer
- Active incidents
- Failed webhooks
- Failed background jobs
- SLA at risk

Listeler:

- My assigned tickets
- Recently escalated tickets
- Active incidents
- System health by service
- Recently resolved tickets

Her kart ilgili filtreli listeye link vermeli.

### 9.2 Ticket Queue — `/support/tickets`

Alanlar:

- Ticket ID
- Subject
- Organization
- Priority
- Status
- Category
- Assignee
- SLA state
- Updated at
- Escalated indicator

Filtreler:

- Status
- Priority
- Category
- Assignee
- Organization
- Created date
- SLA state
- Has request ID
- Escalated
- Search

Sıralama:

- Highest priority
- Oldest
- SLA due soon
- Recently updated

Filtre ve sıralamayı URL search parametrelerinde tut. **Clear filters** aksiyonu ekle. Queue satırından detail sayfasına geçilebilmeli.

### 9.3 Support Ticket Detail — `/support/tickets/:ticketId`

Bu projenin merkez ekranıdır.

Üst özet:

- Ticket ID and subject
- Status
- Priority
- Category
- Organization link
- Assigned agent
- Created and updated date
- SLA due/status
- Escalation state

Hızlı aksiyonlar:

- Assign to me / change assignee
- Change status
- Change priority
- Escalate / remove escalation
- Copy ticket link

Sekmeler:

#### Overview

- Customer report
- Business impact
- Environment
- Affected users
- Request ID
- Occurrence time
- Reproduction steps
- Expected and actual result

Request ID, organization ve ilgili kaynaklar tıklanabilir çapraz bağlantılar olmalı.

#### Conversation

- Customer and agent messages
- Public/private ayrımı
- Attachment metadata
- Public reply formu

Public reply müşteri ekranında görünmelidir.

#### Internal Notes

- Teknik bulgular
- Varsayımlar
- Kontrol edilen sistemler
- Engineering notları
- Yeni internal note formu

Internal note hiçbir Customer route'unda görünmemelidir.

#### Investigation

- Related trace
- Related logs
- Related webhook deliveries
- Related background jobs
- Related incident
- Related runbook
- Reproduction result
- Investigation checklist

Kayıtlar doğru detail route'larına link vermeli.

#### Timeline

Şu tür olayları kronolojik göster:

- Ticket created
- Priority changed
- Agent assigned
- Investigation started
- Customer contacted
- Escalated to engineering
- Fix deployed
- Ticket resolved

Her mutasyon yeni timeline event üretmelidir.

#### Resolution

Form alanları:

- Root cause
- Workaround
- Permanent resolution
- Affected component
- Fix version
- Regression test result
- Customer-facing resolution
- Prevention action

Ticket `resolved` yapılmadan önce root cause ve customer-facing resolution zorunlu olmalıdır. Başarısız validation anlaşılır görünmelidir.

### 9.4 Customer 360 — `/support/customers/:organizationId`

Tek ekranda şu müşteri bağlamını göster:

- Organization profile
- Plan and subscription status
- Users and roles
- API keys — maskeli
- Integrations
- Webhook health
- Recent API requests
- Open tickets
- Related incidents
- Audit/activity log
- Feature/configuration flags

Bu sayfa ticket detayındaki organization linkinden açılmalı.

### 9.5 Request Trace Explorer — `/support/traces`

Filtreler:

- Request ID
- User ID
- Organization
- Endpoint/path
- HTTP status
- Method
- Date range

Liste alanları:

- Request ID
- Method
- Path
- Status
- Duration
- User
- Organization
- Timestamp

Arama filtreleri URL'de tutulmalı. Request ID exact-match araması kolay olmalı.

### 9.6 Request Trace Detail — `/support/traces/:requestId`

- Request metadata
- Masked request headers/body
- Response status and masked body
- Duration
- User and organization links
- Error code
- Sanitized stack trace
- Related structured logs
- Related webhook/job
- Related ticket

Kopyalama aksiyonları: request ID, safe payload, error code. Token, cookie, authorization veya gerçek secret göstermeme.

### 9.7 Log Explorer — `/support/logs`

Filtreler:

- Level: `debug`, `info`, `warn`, `error`
- Service
- Environment
- Request ID
- Organization
- Error code
- Date range
- Free-text search

Her kayıt yapılandırılmış log alanlarıyla gösterilmeli. Satır açıldığında JSON/detail görünümü bulunmalı. İlgili request, organization ve ticket kayıtlarına link verilmeli.

### 9.8 Webhook Delivery Inspector — `/support/webhooks`

Support kullanıcısı bütün demo organizasyonlarının delivery kayıtlarını görebilir.

Filtreler:

- Organization
- Event
- Result
- Status code
- Attempt count
- Date range

Aksiyonlar:

- Retry webhook
- Disable endpoint
- Copy request ID
- Create ticket
- Link/open incident

Mutasyonlar mock state'i ve activity/timeline kayıtlarını güncellemelidir.

### 9.9 Support Webhook Detail — `/support/webhooks/:deliveryId`

Customer detail alanlarına ek olarak:

- Organization link
- Sanitized signature metadata
- Retry history
- Internal error details
- Sanitized stack trace
- Worker job link
- Related logs, trace, ticket and incident

### 9.10 Background Job Monitor — `/support/jobs`

Job type örnekleri:

- `subscription.sync`
- `webhook.delivery`
- `email.notification`
- `usage.recalculate`
- `integration.import`

Durumlar:

- `pending`
- `processing`
- `completed`
- `failed`
- `retrying`
- `dead_letter`

Liste alanları:

- Job ID
- Type
- Organization
- Status
- Attempt
- Created/started/finished at
- Short error
- Request ID

Filtreler: status, type, organization, request ID, date.  
Aksiyonlar: retry, cancel uygun olduğunda, move to dead letter, view related ticket, view logs.

### 9.11 Background Job Detail — `/support/jobs/:jobId`

- Job payload — safe/masked
- Status and attempt history
- Timestamps
- Error code/message
- Sanitized stack trace
- Related organization, request, trace, logs, webhook and ticket
- Retry aksiyonu

### 9.12 Incident Center — `/support/incidents`

Alanlar:

- Incident ID
- Title
- Severity
- Affected service
- Affected organizations count
- Status
- Started at
- Owner

Durumlar:

- `investigating`
- `identified`
- `monitoring`
- `resolved`
- `postmortem_pending`
- `closed`

Filtreler: status, severity, service, owner, date.  
Support Lead incident durumu değiştirebilir. Support Agent read-only görebilir ve ticket ilişkilendirebilir.

### 9.13 Incident Detail — `/support/incidents/:incidentId`

- Summary
- Severity and current status
- Customer impact
- Affected services
- Affected organizations
- Timeline
- Investigation notes
- Root cause
- Mitigation
- Resolution
- Related tickets/logs/traces/jobs/webhooks
- Related pull request placeholder
- Prevention actions
- Postmortem

Demo incident timeline'ı:

```text
14:02 — First error detected
14:08 — First customer ticket received
14:15 — Incident declared
14:27 — Root cause identified
14:36 — Mitigation applied
14:49 — Error rate returned to normal
15:10 — Incident resolved
```

### 9.14 Knowledge Base / Runbooks — `/support/runbooks`

Hazır mock makaleler:

- Troubleshooting 401 authentication errors
- Investigating 403 permission errors
- Checking failed webhook deliveries
- Resolving stuck subscription jobs
- Investigating slow PostgreSQL queries
- Handling external API timeouts
- Collecting information from customers
- Escalating an issue to engineering

Filtreler: category, service, tag, search.  
Liste alanları: title, summary, category, tags, last updated.

### 9.15 Runbook Detail — `/support/runbooks/:slug`

Her makale şu bölümleri desteklemeli:

- Symptoms
- Information to collect
- Investigation steps
- Expected findings
- Safe remediation
- Escalation criteria
- Customer communication template
- Related services/error codes

Markdown benzeri içerik renderer'ı kullanılabilir; kullanıcı girdisi HTML olarak doğrudan render edilmemeli.

## 10. Paylaşılan component kataloğu

Component'leri görsel tasarım açısından değil, davranış ve tekrar kullanım açısından oluştur.

### Navigation

- `AppShell`
- `SidebarNav`
- `TopBar`
- `Breadcrumbs`
- `RoleSwitcher` yalnızca demo kolaylığı gerekiyorsa
- `UserMenu`

### Data display

- `PageHeader`
- `StatCard`
- `DataTable`
- `DefinitionList`
- `StatusBadge`
- `PriorityBadge`
- `SlaIndicator`
- `Timeline`
- `Tabs`
- `CodeBlock`
- `JsonViewer`
- `MaskedValue`
- `CopyButton`
- `EntityLink`

### Forms and filters

- `FormField`
- `SelectField`
- `DateRangeField`
- `SearchInput`
- `FilterBar`
- `Pagination`
- `ReplyComposer`
- `AttachmentMetadataField`

### Feedback and overlays

- `LoadingState`
- `Skeleton` veya sade loading placeholder
- `EmptyState`
- `ErrorState`
- `NotFoundState`
- `InlineAlert`
- `Toast`
- `ConfirmDialog`
- `Modal` veya `Drawer`

Status, priority, date ve identifier gösterimlerini her sayfada yeniden yazma; ortak component/helper kullan.

## 11. Domain modelleri

En az aşağıdaki typed modeller bulunmalı:

- `User`
- `Organization`
- `OrganizationMember`
- `Subscription`
- `ApiKey`
- `Integration`
- `WebhookEndpoint`
- `WebhookDelivery`
- `WebhookAttempt`
- `SupportTicket`
- `TicketMessage`
- `InternalNote`
- `TicketTimelineEvent`
- `TicketResolution`
- `RequestTrace`
- `StructuredLog`
- `BackgroundJob`
- `JobAttempt`
- `Incident`
- `IncidentTimelineEvent`
- `Runbook`
- `ActivityEvent`
- `AttachmentMetadata`
- `SlaPolicy` / `SlaState`

ID'leri string olarak tut. Tarihleri fixture içinde ISO 8601 string olarak sakla, UI katmanında formatla. İlişkileri ortak ID'lerle kur.

Önemli enum/union örnekleri:

```ts
type TicketPriority = 'p1' | 'p2' | 'p3' | 'p4';

type TicketStatus =
  | 'open'
  | 'waiting_for_support'
  | 'waiting_for_customer'
  | 'investigating'
  | 'resolved'
  | 'closed';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type JobStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'retrying'
  | 'dead_letter';
```

## 12. Mock veri planı

Fixture'lar birbirinden kopuk örnekler olmamalı. Aynı ID'ler üzerinden çapraz bağlantılı olay hikâyeleri oluştur.

### 12.1 Minimum veri miktarı

- 3 organization
- 12 organization member
- 8 API key
- 6 integration
- 5 webhook endpoint
- 25 webhook delivery
- 24 support ticket
- Ticket başına uygun sayıda message, note ve timeline event
- 40 request trace
- 100 structured log
- 20 background job
- 3 incident
- 8 runbook
- 50 activity event

Listelerde pagination, filtre ve empty state test edilebilecek kadar çeşitlilik bulunmalı.

### 12.2 Ana demo senaryosu: webhook signature incident

Bu kayıtlar aynı olayla ilişkili olmalı:

```text
Organization: org_northstar
Ticket: SUP-1042
Request ID: req_8bd129c2
Trace: req_8bd129c2
Webhook delivery: whd_2048
Webhook endpoint: whe_northstar_orders
Background job: job_7721
Incident: INC-2026-008
Error code: WEBHOOK_SIGNATURE_INVALID
Service: webhook-worker
```

Hikâye:

- Northstar Labs, `payment.completed` webhook'larında hata görüyor.
- Son delivery HTTP 401 ile başarısız.
- Üç retry attempt var.
- Trace ve log aynı request ID'yi taşıyor.
- Worker job `failed` durumda.
- Root cause: endpoint secret yenilenmiş, worker eski secret versiyonunu kullanmış.
- Workaround: endpoint secret configuration refresh.
- Permanent resolution: secret cache invalidation after rotation.

Bu senaryo bütün ilgili ekranlarda tutarlı görünmeli.

### 12.3 İkinci senaryo: permission cache

```text
Ticket: SUP-1036
Request ID: req_403_role_19
Error code: PERMISSION_CACHE_STALE
Service: api-gateway
```

Hikâye: Kullanıcı Viewer'dan Admin'e geçirilmiş, fakat izin cache'i yenilenmediği için 403 almaya devam ediyor.

### 12.4 Üçüncü senaryo: subscription sync

```text
Ticket: SUP-1029
Request ID: req_sub_5510
Job: job_sub_5510
Error code: SUBSCRIPTION_SYNC_TIMEOUT
Service: billing-worker
```

Hikâye: Ödeme başarılı olmasına rağmen subscription `past_due` görünüyor; sync job external provider timeout nedeniyle retrying durumda.

### 12.5 Veri güvenliği

- API key, authorization header, cookie, password, webhook secret ve token açık metin fixture'a yazma.
- Demo secret gerekiyorsa açıkça sahte ve maskeli tut.
- Request/response gövdelerinde kişisel bilgiyi minimumda tut.
- `maskSensitiveData` helper'ı kullan.

## 13. Mock servis sözleşmeleri

En az aşağıdaki servis gruplarını oluştur:

```text
authService
dashboardService
organizationService
teamService
subscriptionService
apiKeyService
integrationService
webhookService
ticketService
traceService
logService
jobService
incidentService
runbookService
activityService
demoDataService
```

Servis metotları domain odaklı olmalı. Örnek:

```ts
interface TicketService {
  listTickets(query: TicketListQuery): Promise<ServiceResult<Paginated<SupportTicket>>>;
  getTicket(id: string): Promise<ServiceResult<TicketDetail>>;
  createTicket(input: CreateTicketInput): Promise<ServiceResult<SupportTicket>>;
  addPublicReply(ticketId: string, input: ReplyInput): Promise<ServiceResult<TicketMessage>>;
  addInternalNote(ticketId: string, input: NoteInput): Promise<ServiceResult<InternalNote>>;
  assignTicket(ticketId: string, agentId: string): Promise<ServiceResult<SupportTicket>>;
  changeStatus(ticketId: string, status: TicketStatus): Promise<ServiceResult<SupportTicket>>;
  updateResolution(ticketId: string, input: ResolutionInput): Promise<ServiceResult<TicketResolution>>;
}
```

Şunları destekle:

- Pagination tipi
- Query/filter/sort input tipleri
- Not-found ve validation error
- Yapılandırılabilir mock latency
- İstenirse belirli fixture için kontrollü error state
- Mutation sonrası ilişkili timeline/activity üretimi
- Demo verisini resetleme

## 14. Etkileşim ve durum kuralları

### 14.1 URL ile taşınacak state

Liste araması, filtre, sıralama, page ve mümkünse detail tab değerini URL search parametrelerinde tut. Sayfa yenilendiğinde görünüm korunmalı; link paylaşılabilir olmalı.

### 14.2 Mutasyonlar

Her mutasyon:

1. Submit/loading state göstermeli.
2. Başarı veya hata geri bildirimi vermeli.
3. İlgili görünümü güncellemeli.
4. Gerekiyorsa activity/timeline event eklemeli.
5. Duplicate submit'i engellemeli.

### 14.3 Loading, empty ve error

Her async page için:

- Initial loading
- Content
- Empty result
- Filtered empty result
- Recoverable error + retry
- Entity not found

durumlarını ayrı ele al.

### 14.4 Tarih ve saat

- Fixture'lar UTC ISO string kullansın.
- UI kullanıcıya anlaşılır tarih/saat göstersin.
- Exact timestamp gerektiğinde tooltip veya detail içinde yer alsın.
- “SLA due in …” gibi relative süreler test edilebilir helper üzerinden hesaplanmalı.

## 15. Görsel tasarım sınırı

Kullanıcı tasarımı kendisi yapacak. Bu yüzden:

- Renk paleti seçme.
- Marka logosu üretme.
- Özel illüstrasyon veya görsel asset oluşturma.
- Karmaşık animasyon yapma.
- Pixel-perfect dashboard tasarlama.
- Belirli bir UI kitinin görünümünü dayatma.

Buna rağmen frontend şu temel kullanım kalitesine sahip olmalı:

- Semantik HTML
- Klavye ile erişilebilir form, tab, dialog ve navigasyon
- Görünür focus state için temel destek
- Label ve validation mesajları
- Mobilde taşmayan temel responsive iskelet
- Uzun ID, URL, JSON ve stack trace içeriklerinde kontrollü overflow

Minimum, nötr CSS yeterlidir. Yapısal class isimleri ve component sınırları daha sonra tasarım uygulanmasını kolaylaştırmalıdır.

## 16. Açıkça yapılmayacaklar — non-goals

Bu frontend aşamasında aşağıdakileri **yapma**:

- Node.js/NestJS/Express backend kurma
- REST veya GraphQL server yazma
- PostgreSQL/MSSQL veya herhangi bir veritabanı bağlama
- Prisma/TypeORM/Sequelize migration oluşturma
- Gerçek JWT, OAuth, session veya password reset geliştirme
- Gerçek e-posta/SMS gönderme
- Stripe veya başka ödeme sistemi bağlama
- Gerçek Slack, Jira, GitHub veya CRM entegrasyonu kurma
- Gerçek webhook gönderme veya dış endpoint çağırma
- Queue, worker, Redis veya cron job kurma
- Gerçek dosya upload/storage kurma
- Sentry, Datadog, Elasticsearch veya gerçek log altyapısı bağlama
- Production secret veya credential ekleme
- Docker/microservice/Kubernetes altyapısı kurma
- Çoklu dil sistemi kurma
- Canlı chat sistemi kurma
- Marketing site veya blog hazırlama
- Görsel marka tasarımı yapma
- Backend varmış gibi sahte endpoint dokümantasyonu uydurma

Placeholder'lar açıkça **Demo**, **Mock data** veya **Coming in backend phase** olarak işaretlenmeli.

## 17. Uygulama fazları

Fazları sırayla uygula. Bir faz tamamlanmadan sonraki faza geçme.

### Faz 1 — Foundation

- Vite + React + TypeScript kurulumu
- Strict TypeScript ve lint/format ayarları
- Router, providers ve route guards
- Auth, Customer ve Support layout iskeletleri
- Genel error boundary
- 403 ve 404 sayfaları
- Temel test altyapısı

**Çıkış kriteri:** Uygulama ayağa kalkar, route'lar boş placeholder sayfalara gider, rol guard'ları çalışır.

### Faz 2 — Domain ve mock data platformu

- Domain types ve enums
- Seed fixtures
- Çapraz bağlı üç incident senaryosu
- Mock service registry
- localStorage persistence
- Reset demo data
- Mock latency ve error modeli

**Çıkış kriteri:** Page'ler fixture import etmeden typed servislerden veri okuyabilir; reset sonrası deterministic seed geri gelir.

### Faz 3 — Shared application components

- Navigation iskeleti
- Page header, table, filters, badges, timeline
- Loading/empty/error/not-found state'leri
- Form field, dialog, toast, JSON/code viewer
- Masking ve copy helpers

**Çıkış kriteri:** Ortak component'lerin örnek kullanımını test eden en az bir sayfa veya test bulunur.

### Faz 4 — Customer Portal

- Login
- Dashboard
- Team
- Subscription
- API Keys
- Integrations
- Webhooks
- Activity
- Support request list/create/detail

**Çıkış kriteri:** Customer demo akışı baştan sona çalışır ve customer data boundary ihlal edilmez.

### Faz 5 — Support ticket workflow

- Support Dashboard
- Ticket Queue
- Support Ticket Detail bütün sekmeleri
- Customer 360
- Assignment, status, priority, notes, public reply, resolution
- Timeline ve activity otomasyonu

**Çıkış kriteri:** Agent yeni customer ticket'ını bulup araştırma ve resolution akışını tamamlayabilir.

### Faz 6 — Diagnostic explorers

- Request Trace Explorer + detail
- Log Explorer
- Webhook Delivery Inspector + detail
- Background Job Monitor + detail
- Bütün cross-link'ler

**Çıkış kriteri:** `req_8bd129c2` ile başlayan araştırma trace → log → webhook → job → ticket arasında kesintisiz ilerler.

### Faz 7 — Incidents ve runbooks

- Incident list/detail
- Status permissions
- Runbook list/detail
- Ticket/diagnostics bağlantıları

**Çıkış kriteri:** Ana webhook olayı `INC-2026-008` ile ilişkilidir ve ilgili runbook açılabilir.

### Faz 8 — Kalite ve teslim

- Responsive ve accessibility kontrolü
- Empty/error/loading kontrolleri
- Permission ve data-leak kontrolleri
- Unit/integration/E2E smoke testleri
- Typecheck, lint, test ve build
- README'de frontend çalıştırma ve demo hesapları
- Backend phase için kısa handoff notu; backend implementasyonu yok

**Çıkış kriteri:** Tüm kabul kriterleri karşılanır ve temiz production build alınır.

## 18. Test kapsamı

### 18.1 Unit test

- Permission helpers
- Query param parser/serializer
- Masking helpers
- SLA/date helpers
- Mock store reset/persistence
- Ticket resolution validation

### 18.2 Integration test

- Demo login ve role redirect
- Customer Owner yeni ticket oluşturur
- Customer Member yetkisiz aksiyon yapamaz
- Support Agent filtreyle ticket bulur
- Agent internal note ekler; customer ekranında görünmez
- Agent public reply ekler; customer ekranında görünür
- Ticket resolved olmadan zorunlu resolution alanları kontrol edilir
- Webhook retry attempt ekler
- Reset demo data seed state'i geri getirir

### 18.3 E2E smoke test

En az şu kritik yol:

```text
Customer login
→ failed webhook detail
→ create ticket with request ID
→ sign out
→ Support Agent login
→ find ticket
→ trace/log/webhook/job investigation
→ internal note + public reply
→ resolution
→ customer login
→ view public resolution
```

## 19. Kabul kriterleri

Frontend ancak aşağıdakilerin tamamı sağlandığında tamamlanmış sayılır:

### Mimari

- [ ] React + TypeScript strict kullanılıyor.
- [ ] Sayfalar fixture dosyalarını doğrudan import etmiyor.
- [ ] Bütün server-like erişimler typed async servis katmanından geçiyor.
- [ ] Mock ve gelecekteki API implementasyonu ayrılabilecek yapıda.
- [ ] Domain modelleri merkezi ve tutarlı.

### Route ve izinler

- [ ] Bu dokümandaki bütün route'lar çalışıyor.
- [ ] Protected route'lar oturum kontrolü yapıyor.
- [ ] Role permission'ları uygulanıyor.
- [ ] 403, 404 ve entity not-found durumları var.
- [ ] Customer kullanıcıları internal/sensitive support verisine erişemiyor.

### Fonksiyonellik

- [ ] Login ve role redirect çalışıyor.
- [ ] Customer Portal listeleri, filtreleri ve detayları çalışıyor.
- [ ] Ticket oluşturma ve customer reply çalışıyor.
- [ ] Ticket queue filtre/sort state'i URL'de korunuyor.
- [ ] Assignment, priority, status, escalation ve resolution mutasyonları çalışıyor.
- [ ] Internal note customer ekranında görünmüyor.
- [ ] Trace, log, webhook, job, ticket, organization ve incident cross-link'leri çalışıyor.
- [ ] Retry/enable/disable gibi frontend mock aksiyonları state'i güncelliyor.
- [ ] Reset demo data çalışıyor.

### Veri kalitesi

- [ ] Minimum fixture miktarları karşılanıyor.
- [ ] Üç ana incident senaryosu tutarlı ID ilişkilerine sahip.
- [ ] `req_8bd129c2` bütün ilgili ekranlarda bulunabiliyor.
- [ ] Sensitive alanlar maskeli.
- [ ] Timestamps ve status değerleri tutarlı.

### Kullanım kalitesi

- [ ] Her async ana sayfada loading, error, empty ve content durumu var.
- [ ] Formlarda label, validation ve submit state'i var.
- [ ] Dialog ve tab gibi kontroller klavye ile kullanılabiliyor.
- [ ] Uzun teknik içerikler layout'u bozmuyor.
- [ ] Temel mobil görünümde yatay taşma kontrollü.
- [ ] UI metinleri İngilizce.

### Doğrulama

- [ ] Typecheck başarılı.
- [ ] Lint başarılı.
- [ ] Unit/integration testleri başarılı.
- [ ] Kritik E2E smoke testi başarılı.
- [ ] Production build başarılı.
- [ ] Console'da beklenmeyen error veya warning yok.

## 20. Backend'e hazırlık için bırakılacak sınırlar

Frontend tamamlanırken backend'i yazma; yalnızca aşağıdaki sınırları temiz bırak:

- `ServiceResult`, pagination ve error modelleri
- Input/output DTO benzeri TypeScript tipleri
- Service interface'leri
- Mock service implementation'ları
- Merkezi service registry/dependency selection
- Env örneğinde `VITE_DATA_SOURCE=mock`
- Authorization ve secret masking beklentilerini belirten kısa kod notları

Gelecek backend fazında ele alınacak başlıkları README'de sadece listele:

- Authentication and authorization
- REST API
- PostgreSQL schema and migrations
- Background workers and retry policy
- Webhook signing and delivery
- Structured logging and request ID propagation
- File storage
- Automated incident fixtures/seeding

## 21. Antigravity için çalışma talimatı

1. Bu dosyayı eksiksiz oku.
2. Önce mevcut repository'yi incele; çalışan yapıyı gereksiz yere silme.
3. Yalnızca frontend kapsamını uygula.
4. Görsel tasarım uydurmak yerine işlevsel, nötr ve erişilebilir bir iskelet kur.
5. UI metinlerini İngilizce yaz.
6. Mock verileri çapraz bağlantılı ve deterministic üret.
7. Her fazın çıkış kriterini doğruladıktan sonra ilerle.
8. Eksik backend'i gizlemek için gerçek olmayan network çağrıları yazma.
9. Kodun hiçbir yerine production credential veya gerçek kişisel veri koyma.
10. Sonunda typecheck, lint, test ve build çalıştır.
11. Son raporda tamamlanan fazları, test sonuçlarını, bilinen frontend sınırlamalarını ve gelecekte backend'e bağlanacak servis sınırlarını özetle.
12. **Frontend tamamlandığında dur. Backend geliştirmeye başlama.**

## 22. Definition of Done

ResolveOps frontend'i; Customer Portal ve Support Console'un bütün route'larını, rol tabanlı erişimi, typed mock servisleri, tutarlı incident verilerini, çalışan ticket/investigation/resolution akışını ve temel testleri içerdiğinde tamamlanmıştır.

Son ürün, yalnızca ekran koleksiyonu değil; backend olmadan dahi şu yetkinlikleri anlatan etkileşimli bir portföy demosu olmalıdır:

- B2B SaaS ürün mantığını anlama
- Customer ve support kullanıcılarının farklı ihtiyaçlarını modelleme
- Ticket triage ve SLA farkındalığı
- Request ID ile teknik araştırma
- Log, API trace, webhook ve background job ilişkisini kurma
- Root cause, workaround ve resolution belgeleme
- Hassas veriyi maskeleme
- Gelecek backend entegrasyonuna uygun frontend mimarisi kurma
