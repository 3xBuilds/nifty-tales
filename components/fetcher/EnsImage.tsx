import { useEnsAvatar } from 'wagmi'
import { normalize } from 'viem/ens'


function EnsImage({ }) {
    const result = useEnsAvatar({
        name: normalize('wevm.eth'),
      })

  return (
    <img
      src={avatar as string}
      alt={`${name}'s avatar`}
      style={{ width: '100px', height: '100px' }}
    />
  )
}

// Usage example
<EnsImage name="example.eth" />