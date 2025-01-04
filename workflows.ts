// 대표적인 이벤트 식별자들 
type GithubEvent =
    | 'push'              // 브랜치나 태그 푸시
    | 'pull_request'      // PR 관련 활동
    | 'workflow_dispatch' // 수동 실행
    | 'schedule'          // 예약 실행
    | 'release'          // 릴리스 생성
    | 'issues'           // 이슈 관련 활동
    | 'issue_comment'    // 이슈나 PR의 댓글 활동
    | 'discussion'       // 디스커션 관련 활동
    | 'workflow_call'    // 다른 워크플로우에서 호출
    | 'repository_dispatch' // REST API를 통한 외부 이벤트
    | 'deployment'       // 배포 관련 이벤트
    | 'page_build'       // GitHub Pages 빌드
    | 'status'          // Git 커밋 상태 변경
    | 'watch'           // 레포지토리 star 이벤트
    | 'fork'            // 레포지토리 포크
    | 'create'          // 브랜치나 태그 생성
    | 'delete';         // 브랜치나 태그 삭제

// 상세한 옵션을 추가한 이벤트 식별자들
type GithubEventFilter = {
    types: Event[];
    // 이벤트 발생 브랜치
    branches?: string | string[];
    // 이벤트 발생 파일 경로
    paths?: string[];
    // 이벤트 발생 태그
    tags?: string[];
}

export type Workflow = {
    // 워크플로우의 이름. 식별자로 동작한다
    name: string;
    // 워크플로우가 리파지토리와 상호작용하는 이벤트
    on: GithubEvent[] | GithubEventFilter[]

    // 병렬 또는 직렬로 실행되는 업무들
    jobs: Jobs;
}

// 워크플로우의 작업들. 병렬 또는 직렬로 실행된다.
type Jobs = {
    [key: string]: Job;
}

type Job = {
    // job의 실행환경. runner 라고 부른다. 미리 정의되어 있다.
    'runs-on': Runner;
    // job의 실행 단계들. 실제 작업은 이곳에서 한다.
    steps: Step[];
    // 이 job이 실행되기 전에 완료되어야 하는 다른 job들의 이름
    needs?: string | string[];
    // 조건식. 이 조건이 참일 때만 job이 실행됨
    if?: string;
}

// Job의 실행환경. 비용이 부담되면 self-hosted 를 사용한다.
type Runner =
    | 'ubuntu-latest' // 리눅스 환경
    | 'macos-latest' // 맥 환경
    | 'windows-latest' // 윈도우 환경
    | 'self-hosted' // 사용자가 만든 서버 환경

// Job의 실행 단계들. 실제 작업은 이곳에서 한다.
type Step = {
    // Step의 이름. 이해하기 쉬운 이름을 사용한다.
    name?: string;
    // 실행할 cli 명령어. uses 가 없으면 실행한다. 예) npm run build
    run?: string;
    // 사용할 커스텀 액션. 깃허브 액선의 인터페이스 구현체를 저장한 깃허브 리파지토리의 이름을 적는다. 예) actions/checkout
    uses?: string;
    // 액션에 전달할 인자. 예) {ref: 'main'}
    with?: Record<string, string | number | boolean>;
    // 조건식. 예) github.event.pull_request.title === 'test'
    if?: string;
    // 환경변수
    env?: Record<string, string>;
}